import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Get("info")
  getInfo(@Req() req: Request){
    return this.userService.getInfo(req.user.id)
  }
}
