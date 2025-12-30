import 'express';

declare global {
  namespace Express {
    interface Request {
      cookie: {
        'refresh-token'?: string;
        'access-token'?: string;
      };
    }
  }
}

export {};
