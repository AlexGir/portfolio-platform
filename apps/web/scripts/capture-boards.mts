/**
 * Renders every design board (`public/planches/**\/*.html`) to a PNG next to it.
 *
 * The boards are the portfolio's only real design artefacts, so they must show
 * up for every visitor. Embedding the HTML in an iframe does not guarantee that
 * — ad blockers, privacy modes and some embedded browsers refuse nested frames
 * (`ERR_BLOCKED_BY_CLIENT`), which would leave a blank box on a case study.
 * An <img> always renders; the HTML board stays the "open full size" target.
 *
 * Run after adding or editing a board:
 *   pnpm --filter @portfolio/web boards:capture
 *
 * Needs network access: the boards load their fonts from Google Fonts, and the
 * script fails loudly rather than shipping a board rendered in a fallback font.
 */
import { chromium } from '@playwright/test';
import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLANCHES_DIR = join(import.meta.dirname, '../public/planches');
const BOARD_WIDTH = 1800;
const BOARD_HEIGHT = 1069;

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith('.html') ? [full] : [];
    }),
  );
  return files.flat().sort();
}

const boards = await htmlFiles(PLANCHES_DIR);
if (boards.length === 0) {
  console.error(`No board found under ${PLANCHES_DIR}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: BOARD_WIDTH, height: BOARD_HEIGHT },
  deviceScaleFactor: 1,
});

let failed = 0;

for (const board of boards) {
  const output = board.replace(/\.html$/, '.png');
  try {
    await page.goto(pathToFileURL(board).href, { waitUntil: 'networkidle' });
    // Without the webfonts the board renders in a fallback face — not shippable.
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: output, type: 'png' });

    const { size } = await stat(output);
    console.log(`✓ ${relative(PLANCHES_DIR, output)} — ${Math.round(size / 1024)} KB`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${relative(PLANCHES_DIR, board)}: ${(error as Error).message}`);
  }
}

await browser.close();

if (failed > 0) {
  console.error(`\n${failed} board(s) failed to capture.`);
  process.exit(1);
}
console.log(`\n${boards.length} boards captured.`);
