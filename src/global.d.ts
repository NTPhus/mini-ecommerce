import 'express';
import { User } from './modules/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      cookies: {
        'refresh-token'?: string;
        'access-token'?: string;
      };
      user: User
    }
  }
}

export {};
