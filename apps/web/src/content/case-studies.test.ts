import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { caseStudies, getCaseStudy } from './case-studies';
import type { Board, Screen, ScreenGroup } from './case-studies';

const PUBLIC_DIR = join(import.meta.dirname, '../../public');

function allBoards(): Board[] {
  return caseStudies.flatMap((study) => [
    ...(study.approachBoards ?? []),
    ...study.steps.flatMap((step) => step.boards ?? []),
  ]);
}

interface ScreenFigure {
  images: { src: string; width: number; height: number }[];
  alt: string;
  caption: string;
}

/** Flattens both figure shapes — one screen, or a labelled group of them. */
function asFigure(screen: Screen | ScreenGroup): ScreenFigure {
  return 'images' in screen
    ? screen
    : {
        images: [{ src: screen.src, width: screen.width, height: screen.height }],
        alt: screen.alt,
        caption: screen.caption,
      };
}

function allScreenFigures(): ScreenFigure[] {
  return caseStudies.flatMap((study) => [
    ...(study.openingScreen ? [asFigure(study.openingScreen)] : []),
    ...study.steps.flatMap((step) => (step.screens ?? []).map(asFigure)),
  ]);
}

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

  it('ships both the HTML board and its rendered preview for every embed', () => {
    const boards = allBoards();
    expect(boards.length).toBeGreaterThan(0);

    for (const board of boards) {
      expect(board.src).toMatch(/^\/planches\/[a-z0-9/-]+\.html$/);
      expect(existsSync(join(PUBLIC_DIR, board.src)), `missing board: ${board.src}`).toBe(true);

      // Rendered by `pnpm --filter @portfolio/web boards:capture`; without it
      // the case study would show a broken image.
      const preview = board.src.replace(/\.html$/, '.png');
      expect(existsSync(join(PUBLIC_DIR, preview)), `missing preview: ${preview}`).toBe(true);

      expect(board.title).not.toBe('');
      expect(board.caption.length).toBeGreaterThan(20);
    }
  });

  it('ships every interface screenshot, with the alt text and size it declares', () => {
    for (const figure of allScreenFigures()) {
      expect(figure.images.length).toBeGreaterThan(0);

      for (const image of figure.images) {
        expect(image.src).toMatch(/^\/planches\/[a-z0-9/-]+\.png$/);
        expect(existsSync(join(PUBLIC_DIR, image.src)), `missing screen: ${image.src}`).toBe(true);

        // Declared up front so the page does not jump while the image loads.
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      }

      // Alt text carries the content of the figure for anyone who cannot see
      // it, so an empty or token value is a bug, not a style choice.
      expect(figure.alt.length, `alt too short: ${figure.images[0]!.src}`).toBeGreaterThan(30);
      expect(figure.caption.length).toBeGreaterThan(20);
    }
  });

  it('never shows the same screenshot twice', () => {
    const sources = allScreenFigures().flatMap((figure) => figure.images.map((i) => i.src));
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('never embeds the same board twice', () => {
    const sources = allBoards().map((board) => board.src);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('gives every decision table rows that match its headers', () => {
    for (const study of caseStudies) {
      for (const step of study.steps) {
        if (!step.table) continue;
        expect(step.table.headers.length).toBeGreaterThan(1);
        for (const row of step.table.rows) {
          expect(row).toHaveLength(step.table.headers.length);
        }
        if (step.table.chosenRow !== undefined) {
          expect(step.table.rows[step.table.chosenRow]).toBeDefined();
        }
      }
    }
  });

  it('getCaseStudy finds by slug and returns undefined otherwise', () => {
    expect(getCaseStudy(caseStudies[0]!.slug)?.slug).toBe(caseStudies[0]!.slug);
    expect(getCaseStudy('does-not-exist')).toBeUndefined();
  });
});
