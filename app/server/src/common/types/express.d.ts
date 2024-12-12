import { User } from '@prisma/client';
import { Request } from 'express';
import { AppAbility } from '../modules/casl/casl-ability.factory/casl-ability.factory';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
