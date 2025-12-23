import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getInfo(user: User){
    return await this.userRepository.findOne({where : {id: user.id}, select: {id: true, email: true}})
  }
  
}
