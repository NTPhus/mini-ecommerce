import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthenticationDTO } from '../users/dto/authentication.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import axios from 'axios';
import { CacheService } from '../redis/cache.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("register")
  async register(@Body() authenDTO: AuthenticationDTO) {
    const result = await this.authService.register(authenDTO);
    return result ? "Register success!" : "Register failed!";
  }

  @Post("login")
  async login(@Body() authenDTO: AuthenticationDTO, @Res() res: Response) {
    const result = await this.authService.login(authenDTO);
    res.cookie("access-token", result.access_token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
    res.cookie("refresh-token", result.refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    if (result) {
      return res.status(200).json({
        message: "login success!",
        data: result
      });
    }

    return res.status(401).json({ message: "login failed!" });
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) throw new UnauthorizedException();

    const result = await this.authService.refreshAccessToken(refreshToken);
    res.cookie("access-token", result.access_token, { httpOnly: true, maxAge: 30 * 60 * 1000 });

    if (result) {
      return res.status(200).json({
        message: "refresh success!",
        data: result
      });
    }

    return res.status(401).json({ message: "login failed!" });
  }
}

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService
  ) { }

  @Get('login')
  @UseGuards(AuthGuard('oauth2'))
  loginOAuth() { }

  @Get('callback')
  @UseGuards(AuthGuard('oauth2'))
  async callback(@CurrentUser() user: OAuthLoginDto, @Res() res: Response) {
    const result = await this.authService.loginOAuth(user);
    res.cookie("access-token", result.access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refresh-token", result.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("http://localhost:3000")
  }

  @Get('login2')
  loginOAuth2(@Res() res: Response) {
    const authorizationURL = 'https://oauth2.mezon.ai/oauth2/auth';
    const clientID = String(process.env.OAUTH_CLIENT_ID);
    const callbackURL = 'http://localhost:3000/oauth/callback2';
    const scope = 'openid offline offline_access';
    const state = crypto.randomUUID();
    this.cacheService.set(`oauth:state:${state}`, state, 300);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientID,
      redirect_uri: callbackURL,
      scope: scope,
      state: state
    });
    const url = `${authorizationURL}?${params.toString()}`
    return res.redirect(url);
  }

  @Get('callback2')
  async callBack2(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const key = `oauth:state:${state}`;
    const exist = this.cacheService.get(key);
    if (!exist) throw new UnauthorizedException('Invalid or expired state');
    const tokenURL = 'https://oauth2.mezon.ai/oauth2/token'
    const data = {
      'grant_type': 'authorization_code',
      'code': code,
      'state': state,
      'client_id': String(process.env.OAUTH_CLIENT_ID),
      'client_secret': String(process.env.OAUTH_CLIENT_SECRET),
      'redirect_uri': 'http://localhost:3000/oauth/callback2'
    }
    const response = await axios.post(
      `${tokenURL}/`,
      new URLSearchParams(data),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const { access_token } = response.data
    const user: OAuthLoginDto = await this.authService.userInfo(access_token)
    const result = await this.authService.loginOAuth(user);
    res.cookie("access-token", result.access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refresh-token", result.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("http://localhost:3000");
  }
}
