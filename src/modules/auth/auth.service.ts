import { UserService } from './../users/users.service';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthenticationDTO } from '../users/dto/authentication.dto';
import { RefreshTokens } from './entities/refresh-token.entity';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshTokens) private readonly refreshTokenRepository: Repository<RefreshTokens>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
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
      token: bcrypt.hashSync(rt, Number(process.env.SALTS)),
      user: Record,
    })

    await this.refreshTokenRepository.save(refreshToken);

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user']
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
    const {email, user_id} = response.data;

    return {
      email : email,
      provider: "mezon",
      oauthId: user_id
    }
  }

  async loginOAuth(dto: OAuthLoginDto) {
    if (!dto.email) {
      throw new BadRequestException('OAuth provider did not return email');
    }

    let user = await this.userService.findByOAuth(
      dto.provider,
      dto.oauthId,
    );

    if (!user) {
      user = await this.userService.createOAuthUser({
        email: dto.email,
        provider: dto.provider,
        providerId: dto.oauthId,
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
