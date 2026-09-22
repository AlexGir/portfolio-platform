import { expect, test } from '@playwright/test';

test.describe('case studies', () => {
  test('the work index lists every project and links to its case study', async ({ page }) => {
    await page.goto('/work');
    await expect(page.getByRole('heading', { level: 1, name: 'Projets' })).toBeVisible();

    const links = page.getByRole('link', { name: /Lire l'étude de cas/ });
    await expect(links).toHaveCount(4);
  });

  test('a homepage project card opens its full case study', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Lire l'étude de cas/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/work\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Headings, not free text: the narrative copy legitimately repeats these words.
    for (const name of ['Le problème', 'La solution', 'Résultats']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
  });

  test('case study navigation links to another project', async ({ page }) => {
    await page.goto('/work/skales-refonte-plateforme');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('plateforme multi-profils');

    await page
      .getByRole('navigation', { name: 'Autres projets' })
      .getByRole('link')
      .first()
      .click();
    await expect(page).toHaveURL(/\/work\/.+/);
    await expect(page).not.toHaveURL(/\/work\/skales-refonte-plateforme$/);
  });

  test('a case study embeds its design boards and links them full size', async ({ page }) => {
    await page.goto('/work/skales-refonte-plateforme');

    const board = page.getByRole('link', { name: /Ouvrir la planche .* en grand format/ }).first();
    await expect(board).toBeVisible();
    await expect(board).toHaveAttribute('href', /^\/planches\/.+\.html$/);
  });

  test('an unknown project slug renders the 404 page', async ({ page }) => {
    const response = await page.goto('/work/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('Page introuvable')).toBeVisible();
  });
});
