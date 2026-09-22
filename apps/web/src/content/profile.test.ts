import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { profile } from './profile';

const PUBLIC_DIR = join(import.meta.dirname, '../../public');

describe('profile content', () => {
  it('ships the CV it links to', () => {
    expect(profile.resume.href).toMatch(/^\/[\w-]+\.pdf$/);
    expect(
      existsSync(join(PUBLIC_DIR, profile.resume.href)),
      `missing CV: ${profile.resume.href}`,
    ).toBe(true);
    expect(profile.resume.updated).not.toBe('');
  });

  it('points every social link at an actual profile, not a bare homepage', () => {
    expect(profile.socials.length).toBeGreaterThan(0);

    for (const social of profile.socials) {
      expect(social.label).not.toBe('');
      expect(social.href).toMatch(/^https:\/\//);
      // A placeholder like "https://www.linkedin.com/" is worse than no link at
      // all: it looks deliberate and leads nowhere.
      const { pathname } = new URL(social.href);
      expect(pathname.replace(/\/$/, ''), `${social.label} has no profile path`).not.toBe('');
    }
  });

  it('uses a plausible contact address', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
  });
});
