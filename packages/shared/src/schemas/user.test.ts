import { describe, expect, it } from 'vitest';
import { userDtoSchema } from './user.js';

describe('userDtoSchema', () => {
  const valid = {
    id: '3f1e7a4c-2b6d-4c8e-9a1f-0d5b7c9e2a11',
    email: 'alex@example.com',
    displayName: 'Alex',
    avatarUrl: 'https://example.com/a.png',
    role: 'admin',
    createdAt: '2026-09-01T10:00:00.000Z',
  };

  it('parses a well-formed user', () => {
    expect(userDtoSchema.parse(valid)).toEqual(valid);
  });

  it('allows a null avatar', () => {
    expect(userDtoSchema.parse({ ...valid, avatarUrl: null }).avatarUrl).toBeNull();
  });

  it('rejects an invalid email', () => {
    expect(userDtoSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });

  it('rejects a non-url avatar that is not null', () => {
    expect(userDtoSchema.safeParse({ ...valid, avatarUrl: 'not-a-url' }).success).toBe(false);
  });
});
