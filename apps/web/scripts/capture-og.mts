/**
 * Renders the social share card to `public/og.png`.
 *
 * Why a committed PNG rather than a generated one: `next/og` would keep the
 * card in sync automatically, but it needs font bytes at build time, and a
 * share image is not worth adding a way for the production build to fail. The
 * repo already renders HTML to PNG with Playwright for the design boards, so
 * this reuses that pipeline rather than introducing a second mechanism.
 *
 * The trade is that the card does not follow the content on its own. Re-run it
 * after changing the name, the role or the tagline in `content/profile.ts`:
 *   pnpm --filter @portfolio/web og:capture
 *
 * Needs network access: the card loads its fonts from Google Fonts, and the
 * script fails loudly rather than shipping a card in a fallback face.
 */
import { chromium } from '@playwright/test';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { profile } from '../src/content/profile.ts';

/** The size every platform crops from; 1.91:1, the Open Graph standard. */
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = join(import.meta.dirname, '../public/og.png');

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const [firstName, ...lastName] = profile.name.split(' ');

/*
 * The card is the hero, recomposed for a thumbnail: same stock, same violet
 * field bleeding off the right, same type pairing. The name carries it, because
 * at the size LinkedIn actually renders this, the tagline is barely readable
 * and the name has to do the work on its own.
 */
const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap"
      rel="stylesheet"
    />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        background: #f4f3f7;
        color: #0a0a0f;
        font-family: 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
      }
      .field {
        position: absolute;
        top: -220px;
        right: -180px;
        width: 760px;
        height: 760px;
        border-radius: 999px;
        background: #5928ff;
        opacity: 0.4;
        filter: blur(90px);
      }
      .inner {
        position: relative;
        height: 100%;
        padding: 72px 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #4718cc;
      }
      h1 {
        font-family: 'Fraunces', serif;
        font-weight: 700;
        font-size: 104px;
        line-height: 0.95;
        letter-spacing: -0.05em;
        margin-top: 28px;
      }
      .tagline {
        font-size: 29px;
        line-height: 1.4;
        color: #5b5966;
        max-width: 880px;
        margin-top: 30px;
      }
      .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 2px solid #0a0a0f;
        padding-top: 22px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 19px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .foot .site { color: #4718cc; }
    </style>
  </head>
  <body>
    <div class="field"></div>
    <div class="inner">
      <div>
        <p class="eyebrow">${escape(profile.role)}</p>
        <h1>${escape(firstName ?? '')}<br />${escape(lastName.join(' '))}</h1>
        <p class="tagline">${escape(profile.tagline)}</p>
      </div>
      <div class="foot">
        <span>${escape(profile.location)}</span>
        <span class="site">alexandregiraud.tech</span>
      </div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

try {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const rendered = await page.evaluate(() =>
    document.fonts.check("700 104px 'Fraunces'"),
  );
  if (!rendered) throw new Error('Fraunces did not load — the card would ship in a fallback face');

  await page.screenshot({ path: OUTPUT, type: 'png' });
  const { size } = await stat(OUTPUT);
  console.log(`✓ public/og.png — ${WIDTH}x${HEIGHT}, ${Math.round(size / 1024)} KB`);
} catch (error) {
  console.error(`✗ ${(error as Error).message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
