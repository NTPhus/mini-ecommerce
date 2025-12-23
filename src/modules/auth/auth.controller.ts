import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthenticationDTO } from '../users/dto/authentication.dto';
import { AuthService } from './auth.service';


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
    res.cookie("access-token", result.access_token, { httpOnly: true , maxAge: 30 * 60 * 1000});
    res.cookie("refresh-token", result.refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});
    if (result) {
      return res.status(200).json({
        message: "login success!",
        data: result
      });
    }

    return res.status(401).json({ message: "login failed!" });
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response){
    const refreshToken = req.cookies['refresh-token'];
    if(!refreshToken) throw new UnauthorizedException();

    const result = await this.authService.refreshAccessToken(refreshToken);
    res.cookie("access-token", result.access_token, { httpOnly: true , maxAge: 30 * 60 * 1000});
    
    if (result) {
      return res.status(200).json({
        message: "refresh success!",
        data: result
      });
    }

    return res.status(401).json({ message: "login failed!" });
  }
}
