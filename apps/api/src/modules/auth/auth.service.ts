import type { PrismaClient, User } from '@prisma/client';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from '@portfolio/shared';
import { signAccessToken } from '../../lib/jwt.js';
import { generateRefreshToken, hashRefreshToken } from '../../lib/refresh-token.js';
import { unauthorized } from '../../lib/http-error.js';
import type { OAuthUserProfile } from './oauth-provider.js';

/** The slice of PrismaClient the auth service touches. */
export type AuthRepository = Pick<PrismaClient, 'user' | 'oAuthAccount' | 'refreshToken'>;

export interface IssuedSession {
  accessToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
  /** Raw refresh token — returned once, only its hash is persisted. */
  refreshToken: string;
  refreshExpiresAt: Date;
  refreshTokenId: string;
}

export interface AuthServiceOptions {
  prisma: AuthRepository;
  accessSecret: string;
  /** Injectable clock for deterministic tests. */
  now?: () => Date;
}

export class AuthService {
  private readonly prisma: AuthRepository;
  private readonly accessSecret: string;
  private readonly now: () => Date;

  constructor({ prisma, accessSecret, now }: AuthServiceOptions) {
    this.prisma = prisma;
    this.accessSecret = accessSecret;
    this.now = now ?? (() => new Date());
  }

  /**
   * Resolve the platform user for an OAuth profile:
   * 1. known provider account → its user;
   * 2. otherwise a user with the same e-mail → link a new account to it;
   * 3. otherwise create the user and the account together.
   */
  async findOrCreateUser(profile: OAuthUserProfile): Promise<User> {
    const linked = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: { user: true },
    });
    if (linked) return linked.user;

    const byEmail = await this.prisma.user.findUnique({ where: { email: profile.email } });
    if (byEmail) {
      await this.prisma.oAuthAccount.create({
        data: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
          userId: byEmail.id,
        },
      });
      return byEmail;
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        accounts: {
          create: {
            provider: profile.provider,
            providerAccountId: profile.providerAccountId,
          },
        },
      },
    });
  }

  /** Mint an access token and persist a fresh refresh token for the user. */
  async issueSession(user: Pick<User, 'id' | 'email' | 'role'>): Promise<IssuedSession> {
    const access = await signAccessToken(
      { sub: user.id, email: user.email, role: user.role },
      this.accessSecret,
      ACCESS_TOKEN_TTL_SECONDS,
    );
    const refreshToken = generateRefreshToken();
    const refreshExpiresAt = new Date(this.now().getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000);

    const row = await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken: access.token,
      expiresIn: access.expiresIn,
      refreshToken,
      refreshExpiresAt,
      refreshTokenId: row.id,
    };
  }

  /**
   * Exchange a valid refresh token for a new session and revoke the old token
   * (rotation). Presenting a revoked or expired token is treated as possible
   * theft: every active refresh token for that user is revoked.
   */
  async rotateRefreshToken(rawToken: string): Promise<IssuedSession> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashRefreshToken(rawToken) },
      include: { user: true },
    });
    if (!record) throw unauthorized('Invalid refresh token');

    const expired = record.expiresAt.getTime() <= this.now().getTime();
    if (record.revokedAt || expired) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: this.now() },
      });
      throw unauthorized('Refresh token is no longer valid');
    }

    const session = await this.issueSession(record.user);
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: this.now(), replacedById: session.refreshTokenId },
    });
    return session;
  }

  /** Revoke a refresh token. Idempotent — unknown or already-revoked tokens are a no-op. */
  async revokeRefreshToken(rawToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashRefreshToken(rawToken), revokedAt: null },
      data: { revokedAt: this.now() },
    });
  }
}
