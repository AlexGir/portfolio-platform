import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { notFound, unauthorized } from '../../lib/http-error.js';
import { getUserById, toUserDto, type UsersRepository } from './users.service.js';

export interface UsersRouterOptions {
  prisma: UsersRepository;
  accessSecret: string;
}

export function usersRouter({ prisma, accessSecret }: UsersRouterOptions): Router {
  const router = Router();

  // `GET /users/me` — the authenticated user's profile.
  router.get('/users/me', authenticate(accessSecret), async (req, res, next) => {
    try {
      if (!req.user) throw unauthorized();
      const user = await getUserById(prisma, req.user.sub);
      if (!user) throw notFound('User no longer exists');
      res.json(toUserDto(user));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
