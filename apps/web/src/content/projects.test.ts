import { describe, expect, it } from 'vitest';
import { getProject, projects } from './projects';

describe('projects content', () => {
  it('has unique, url-safe slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('fills every required field', () => {
    for (const project of projects) {
      expect(project.title).not.toBe('');
      expect(project.summary).not.toBe('');
      expect(project.description.length).toBeGreaterThan(20);
      expect(project.stack.length).toBeGreaterThan(0);
    }
  });

  it('getProject finds by slug and returns undefined otherwise', () => {
    expect(getProject(projects[0]!.slug)?.slug).toBe(projects[0]!.slug);
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});
