import { User } from '../../entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};