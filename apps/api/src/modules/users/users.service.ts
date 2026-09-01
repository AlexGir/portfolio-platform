import type { PrismaClient, User } from '@prisma/client';
import { userDtoSchema, type UserDto } from '@portfolio/shared';

export type UsersRepository = Pick<PrismaClient, 'user'>;

/** Map a Prisma `User` row to the public DTO (dates as ISO strings, validated). */
export function toUserDto(user: User): UserDto {
  return userDtoSchema.parse({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  });
}

export function getUserById(prisma: UsersRepository, id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
