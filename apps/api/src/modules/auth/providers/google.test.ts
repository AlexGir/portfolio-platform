import { describe, expect, it } from 'vitest';
import { HttpError } from '../../../lib/http-error.js';
import { mapGoogleUserinfo } from './google.js';

const userinfo = {
  sub: '110169484474386276334',
  email: 'alex@example.com',
  email_verified: true,
  name: 'Alex G',
  picture: 'https://lh3.googleusercontent.com/a/abc',
};

describe('mapGoogleUserinfo', () => {
  it('normalises a Google userinfo payload', () => {
    expect(mapGoogleUserinfo(userinfo)).toEqual({
      provider: 'google',
      providerAccountId: '110169484474386276334',
      email: 'alex@example.com',
      displayName: 'Alex G',
      avatarUrl: 'https://lh3.googleusercontent.com/a/abc',
    });
  });

  it('falls back to the e-mail when no name is present', () => {
    const { name: _name, ...withoutName } = userinfo;
    expect(mapGoogleUserinfo(withoutName).displayName).toBe('alex@example.com');
  });

  it('rejects an unverified e-mail', () => {
    expect(() => mapGoogleUserinfo({ ...userinfo, email_verified: false })).toThrow(HttpError);
  });

  it('rejects a payload without a subject', () => {
    const { sub: _sub, ...withoutSub } = userinfo;
    expect(() => mapGoogleUserinfo(withoutSub)).toThrow();
  });
});
