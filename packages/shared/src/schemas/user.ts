import { z } from 'zod';
import { userRoleSchema } from './auth.js';

/**
 * Public representation of a user, safe to send to clients.
 * Never includes provider tokens, refresh tokens or internal flags.
 */
export const userDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
  role: userRoleSchema,
  /** ISO-8601 creation timestamp. */
  createdAt: z.string().datetime(),
});
export type UserDto = z.infer<typeof userDtoSchema>;
