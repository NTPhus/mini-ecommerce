import { UserService } from './../users/users.service';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthenticationDTO } from '../users/dto/authentication.dto';
import { RefreshTokens } from './entities/refresh-token.entity';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import axios from 'axios';
import { CacheService } from '../redis/cache.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshTokens) private readonly refreshTokenRepository: Repository<RefreshTokens>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService
  ) { }

  async register(user: AuthenticationDTO) {
    const exist = await this.userRepository.findOneBy({ email: user.email });
    if (exist) throw new ForbiddenException("This email is exist!");

    user.password = await bcrypt.hashSync(user.password, Number(process.env.SALTS));
    return this.userRepository.save(user);
  }

  async login(user: AuthenticationDTO) {

    const Record = await this.userRepository.findOneBy({ email: user.email });
    if (!Record) throw new UnauthorizedException("This email not exist!");

    const compare = await bcrypt.compare(user.password, Record.password);
    if (!compare) throw new UnauthorizedException("Password incorrect!");
    const payload = { id: Record.id, email: Record.email }

    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(payload, { expiresIn: "30m" }),
      await this.jwtService.signAsync(payload, { expiresIn: "3d" })
    ])

    const refreshToken = this.refreshTokenRepository.create({
      token: rt, 
      user: Record,
    })

    await this.refreshTokenRepository.save(refreshToken);

    return {
      access_token: at,
      refresh_token: rt,
      user: Record
    }
  }

  async refreshAccessToken(userId: number, refreshToken: string) {

    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken ,
        user: {
          id: userId
        }
      }
    })

    if (!tokenRecord) throw new UnauthorizedException("Token is not exist");
    if (tokenRecord.revoked) throw new UnauthorizedException("This token was revoked");
    if (tokenRecord.expired_at < new Date()) throw new UnauthorizedException("This token was expired!");

    const newAccessToken = await this.jwtService.signAsync({
      id: tokenRecord.user.id,
      email: tokenRecord.user.email
    })

    return { access_token: newAccessToken };
  }

  async userInfo(accessToken: string) {
    const response = await axios.get(
      'https://oauth2.mezon.ai/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(response.data);
    const { email, user_id } = response.data;

    return {
      email: email,
      provider: "mezon",
      providerId: user_id
    }
  }

  async revokeToken(userId: number) {
    this.cacheService.del(`userId:${userId}`);
    await this.refreshTokenRepository.update({ user: { id: userId }, revoked: false, expired_at: MoreThan(new Date()) }, { revoked: true })
    return "Revoke success"
  }

  async loginOAuth(dto: OAuthLoginDto) {
    if (!dto.email) {
      throw new BadRequestException('OAuth provider did not return email');
    }

    let user = await this.userService.findByOAuth(
      dto.provider,
      dto.providerId,
    );

    if (!user) {
      user = await this.userService.createOAuthUser({
        email: dto.email,
        provider: dto.provider,
        providerId: dto.providerId,
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      provider: dto.provider,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user,
    };
  }


}
