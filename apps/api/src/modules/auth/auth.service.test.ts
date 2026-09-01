import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { OAuthAccount, RefreshToken, User } from '@prisma/client';
import { verifyAccessToken } from '../../lib/jwt.js';
import { hashRefreshToken } from '../../lib/refresh-token.js';
import { HttpError } from '../../lib/http-error.js';
import { AuthService, type AuthRepository } from './auth.service.js';
import type { OAuthUserProfile } from './oauth-provider.js';

const ACCESS_SECRET = 'auth-service-test-secret-0123456789';

/**
 * Tiny in-memory stand-in for the slice of PrismaClient the auth service uses.
 * Only the query shapes actually issued by AuthService are supported.
 */
class InMemoryAuthRepo {
  users: User[] = [];
  accounts: OAuthAccount[] = [];
  tokens: RefreshToken[] = [];

  user = {
    findUnique: ({ where }: { where: { email?: string; id?: string } }) =>
      Promise.resolve(
        this.users.find((u) => (where.email ? u.email === where.email : u.id === where.id)) ?? null,
      ),
    create: ({
      data,
    }: {
      data: {
        email: string;
        displayName: string;
        avatarUrl: string | null;
        accounts?: { create: { provider: OAuthAccount['provider']; providerAccountId: string } };
      };
    }) => {
      const now = new Date();
      const user: User = {
        id: randomUUID(),
        email: data.email,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };
      this.users.push(user);
      if (data.accounts) {
        this.accounts.push({
          id: randomUUID(),
          provider: data.accounts.create.provider,
          providerAccountId: data.accounts.create.providerAccountId,
          userId: user.id,
          createdAt: now,
        });
      }
      return Promise.resolve(user);
    },
  };

  oAuthAccount = {
    findUnique: ({
      where,
    }: {
      where: { provider_providerAccountId: { provider: string; providerAccountId: string } };
    }) => {
      const key = where.provider_providerAccountId;
      const account = this.accounts.find(
        (a) => a.provider === key.provider && a.providerAccountId === key.providerAccountId,
      );
      if (!account) return Promise.resolve(null);
      const user = this.users.find((u) => u.id === account.userId) ?? null;
      return Promise.resolve({ ...account, user });
    },
    create: ({
      data,
    }: {
      data: { provider: OAuthAccount['provider']; providerAccountId: string; userId: string };
    }) => {
      const account: OAuthAccount = { id: randomUUID(), createdAt: new Date(), ...data };
      this.accounts.push(account);
      return Promise.resolve(account);
    },
  };

  refreshToken = {
    create: ({ data }: { data: { tokenHash: string; userId: string; expiresAt: Date } }) => {
      const token: RefreshToken = {
        id: randomUUID(),
        tokenHash: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
        revokedAt: null,
        replacedById: null,
        createdAt: new Date(),
      };
      this.tokens.push(token);
      return Promise.resolve(token);
    },
    findUnique: ({ where }: { where: { tokenHash: string } }) => {
      const token = this.tokens.find((t) => t.tokenHash === where.tokenHash);
      if (!token) return Promise.resolve(null);
      const user = this.users.find((u) => u.id === token.userId) ?? null;
      return Promise.resolve({ ...token, user });
    },
    update: ({
      where,
      data,
    }: {
      where: { id: string };
      data: { revokedAt?: Date; replacedById?: string | null };
    }) => {
      const token = this.tokens.find((t) => t.id === where.id);
      if (token) Object.assign(token, data);
      return Promise.resolve(token as RefreshToken);
    },
    updateMany: ({
      where,
      data,
    }: {
      where: { userId?: string; tokenHash?: string; revokedAt: null };
      data: { revokedAt: Date };
    }) => {
      let count = 0;
      for (const token of this.tokens) {
        const matchesUser = where.userId ? token.userId === where.userId : true;
        const matchesHash = where.tokenHash ? token.tokenHash === where.tokenHash : true;
        if (matchesUser && matchesHash && token.revokedAt === null) {
          token.revokedAt = data.revokedAt;
          count += 1;
        }
      }
      return Promise.resolve({ count });
    },
  };
}

const profile: OAuthUserProfile = {
  provider: 'github',
  providerAccountId: '4567',
  email: 'alex@example.com',
  displayName: 'Alex G',
  avatarUrl: null,
};

let repo: InMemoryAuthRepo;
let service: AuthService;

beforeEach(() => {
  repo = new InMemoryAuthRepo();
  service = new AuthService({
    prisma: repo as unknown as AuthRepository,
    accessSecret: ACCESS_SECRET,
  });
});

describe('findOrCreateUser', () => {
  it('creates the user and the linked account on first login', async () => {
    const user = await service.findOrCreateUser(profile);
    expect(repo.users).toHaveLength(1);
    expect(repo.accounts).toHaveLength(1);
    expect(repo.accounts[0]?.userId).toBe(user.id);
  });

  it('returns the same user when the account is already known', async () => {
    const first = await service.findOrCreateUser(profile);
    const second = await service.findOrCreateUser(profile);
    expect(second.id).toBe(first.id);
    expect(repo.users).toHaveLength(1);
    expect(repo.accounts).toHaveLength(1);
  });

  it('links a new provider account to an existing user with the same e-mail', async () => {
    const first = await service.findOrCreateUser(profile);
    const linked = await service.findOrCreateUser({
      ...profile,
      provider: 'google',
      providerAccountId: 'g-1',
    });
    expect(linked.id).toBe(first.id);
    expect(repo.users).toHaveLength(1);
    expect(repo.accounts).toHaveLength(2);
  });
});

describe('issueSession', () => {
  it('mints a verifiable access token and stores a hashed refresh token', async () => {
    const user = await service.findOrCreateUser(profile);
    const session = await service.issueSession(user);

    const payload = await verifyAccessToken(session.accessToken, ACCESS_SECRET);
    expect(payload.sub).toBe(user.id);
    expect(session.expiresIn).toBeGreaterThan(0);

    expect(repo.tokens).toHaveLength(1);
    expect(repo.tokens[0]?.tokenHash).toBe(hashRefreshToken(session.refreshToken));
    expect(repo.tokens[0]?.tokenHash).not.toBe(session.refreshToken);
  });
});

describe('rotateRefreshToken', () => {
  it('issues a new session and revokes the presented token', async () => {
    const user = await service.findOrCreateUser(profile);
    const first = await service.issueSession(user);
    const rotated = await service.rotateRefreshToken(first.refreshToken);

    expect(rotated.refreshToken).not.toBe(first.refreshToken);
    const old = repo.tokens.find((t) => t.id === first.refreshTokenId);
    expect(old?.revokedAt).toBeInstanceOf(Date);
    expect(old?.replacedById).toBe(rotated.refreshTokenId);
  });

  it('rejects an unknown token', async () => {
    await expect(service.rotateRefreshToken('nope')).rejects.toBeInstanceOf(HttpError);
  });

  it('rejects a reused (already-rotated) token and revokes the whole family', async () => {
    const user = await service.findOrCreateUser(profile);
    const first = await service.issueSession(user);
    const second = await service.rotateRefreshToken(first.refreshToken);

    await expect(service.rotateRefreshToken(first.refreshToken)).rejects.toMatchObject({
      status: 401,
    });

    const active = repo.tokens.filter((t) => t.revokedAt === null);
    expect(active).toHaveLength(0);
    expect(second.refreshToken).toBeDefined();
  });

  it('rejects an expired token', async () => {
    const user = await service.findOrCreateUser(profile);
    const session = await service.issueSession(user);

    const stored = repo.tokens.find((t) => t.id === session.refreshTokenId);
    stored!.expiresAt = new Date(Date.now() - 1000);

    await expect(service.rotateRefreshToken(session.refreshToken)).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe('revokeRefreshToken', () => {
  it('revokes a valid token and is idempotent', async () => {
    const user = await service.findOrCreateUser(profile);
    const session = await service.issueSession(user);

    await service.revokeRefreshToken(session.refreshToken);
    await service.revokeRefreshToken(session.refreshToken);
    await service.revokeRefreshToken('unknown-token');

    expect(repo.tokens[0]?.revokedAt).toBeInstanceOf(Date);
  });
});
