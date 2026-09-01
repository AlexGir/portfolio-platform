import { buildHealthReport } from '../modules/health/health.service.js';
import { toUserDto } from '../modules/users/users.service.js';
import type { GraphQLContext } from './context.js';

export const resolvers = {
  Query: {
    health: (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      buildHealthReport(ctx.health, ctx.meta),

    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (!ctx.user) return null;
      const user = await ctx.prisma.user.findUnique({ where: { id: ctx.user.sub } });
      return user ? toUserDto(user) : null;
    },
  },
};
