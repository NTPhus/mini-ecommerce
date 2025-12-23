import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
  getInfo(@Body() user: User){
    return this.userService.getInfo(user)
  }
}
