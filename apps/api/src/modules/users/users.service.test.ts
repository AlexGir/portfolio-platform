import { describe, expect, it } from 'vitest';
import type { User } from '@prisma/client';
import { toUserDto } from './users.service.js';

const row: User = {
  id: '3f1e7a4c-2b6d-4c8e-9a1f-0d5b7c9e2a11',
  email: 'alex@example.com',
  displayName: 'Alex',
  avatarUrl: null,
  role: 'user',
  createdAt: new Date('2026-09-01T10:00:00.000Z'),
  updatedAt: new Date('2026-09-02T10:00:00.000Z'),
};

describe('toUserDto', () => {
  it('maps a Prisma row to the public DTO with an ISO date', () => {
    expect(toUserDto(row)).toEqual({
      id: row.id,
      email: 'alex@example.com',
      displayName: 'Alex',
      avatarUrl: null,
      role: 'user',
      createdAt: '2026-09-01T10:00:00.000Z',
    });
  });

  it('does not leak fields that are not part of the DTO', () => {
    expect(toUserDto(row)).not.toHaveProperty('updatedAt');
  });
});
