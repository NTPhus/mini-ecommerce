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

  async getInfo(user: User) {
    return await this.userRepository.findOne({ where: { id: user.id }, select: { id: true, email: true } })
  }

  async findByOAuth(provider: string, providerId: string) {
    return this.userRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });
  }

  async createOAuthUser(data: {
    email?: string;
    provider: string;
    providerId: string;
  }) {
    const user = this.userRepository.create({
      email: data.email,
      provider: data.provider,
      providerId: data.providerId,
    });

    return this.userRepository.save(user);
  }
}
