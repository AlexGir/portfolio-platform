import { describe, expect, it } from 'vitest';
import { caseStudies, getCaseStudy } from './case-studies';

describe('case studies content', () => {
  it('has unique, url-safe slugs', () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('fills every required narrative field', () => {
    for (const study of caseStudies) {
      expect(study.title).not.toBe('');
      expect(study.summary.length).toBeGreaterThan(20);
      expect(study.tags.length).toBeGreaterThan(0);
      expect(study.overview.problem.length).toBeGreaterThan(0);
      expect(study.overview.solution.length).toBeGreaterThan(0);
      expect(study.steps.length).toBeGreaterThan(0);
      expect(study.impact.length).toBeGreaterThan(0);
      expect(study.reflection.text.length).toBeGreaterThan(20);
      expect(study.closing.length).toBeGreaterThan(0);
    }
  });

  it('numbers process steps sequentially from 01', () => {
    for (const study of caseStudies) {
      const indexes = study.steps.map((step) => step.index);
      expect(indexes).toEqual(indexes.map((_, i) => String(i + 1).padStart(2, '0')));
    }
  });

  it('every step detail (when present) has at least one bullet', () => {
    for (const study of caseStudies) {
      for (const step of study.steps) {
        if (step.detail) {
          expect(step.detail.heading).not.toBe('');
          expect(step.detail.bullets.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('cover tones are valid hex colours', () => {
    const hex = /^#[0-9a-f]{6}$/i;
    for (const study of caseStudies) {
      expect(study.cover.primary).toMatch(hex);
      expect(study.cover.secondary).toMatch(hex);
    }
  });

  it('getCaseStudy finds by slug and returns undefined otherwise', () => {
    expect(getCaseStudy(caseStudies[0]!.slug)?.slug).toBe(caseStudies[0]!.slug);
    expect(getCaseStudy('does-not-exist')).toBeUndefined();
  });
});
