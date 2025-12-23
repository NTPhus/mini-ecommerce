import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

}
