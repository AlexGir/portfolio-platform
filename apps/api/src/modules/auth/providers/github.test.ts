import { describe, expect, it } from 'vitest';
import { HttpError } from '../../../lib/http-error.js';
import { mapGitHubProfile, resolveGitHubEmail } from './github.js';

const user = {
  id: 4567,
  login: 'alexg',
  name: 'Alex G',
  avatar_url: 'https://avatars.githubusercontent.com/u/4567',
  email: null,
};

describe('resolveGitHubEmail', () => {
  it('prefers the primary verified address', () => {
    const email = resolveGitHubEmail(user, [
      { email: 'secondary@example.com', primary: false, verified: true },
      { email: 'primary@example.com', primary: true, verified: true },
    ]);
    expect(email).toBe('primary@example.com');
  });

  it('falls back to any verified address', () => {
    const email = resolveGitHubEmail(user, [
      { email: 'unverified@example.com', primary: true, verified: false },
      { email: 'verified@example.com', primary: false, verified: true },
    ]);
    expect(email).toBe('verified@example.com');
  });

  it('falls back to the profile email when no verified address exists', () => {
    expect(resolveGitHubEmail({ ...user, email: 'profile@example.com' }, [])).toBe(
      'profile@example.com',
    );
  });

  it('returns null when nothing usable is available', () => {
    expect(resolveGitHubEmail(user, [])).toBeNull();
  });
});

describe('mapGitHubProfile', () => {
  it('normalises a GitHub profile', () => {
    const profile = mapGitHubProfile(user, [
      { email: 'primary@example.com', primary: true, verified: true },
    ]);
    expect(profile).toEqual({
      provider: 'github',
      providerAccountId: '4567',
      email: 'primary@example.com',
      displayName: 'Alex G',
      avatarUrl: 'https://avatars.githubusercontent.com/u/4567',
    });
  });

  it('uses the login when the profile has no name', () => {
    const profile = mapGitHubProfile({ ...user, name: null }, [
      { email: 'primary@example.com', primary: true, verified: true },
    ]);
    expect(profile.displayName).toBe('alexg');
  });

  it('throws a 400 when no e-mail can be resolved', () => {
    expect(() => mapGitHubProfile(user, [])).toThrow(HttpError);
  });

  it('rejects a malformed GitHub payload', () => {
    expect(() => mapGitHubProfile({ id: 'nope' }, [])).toThrow();
  });
});
