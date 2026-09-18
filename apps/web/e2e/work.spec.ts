import { expect, test } from '@playwright/test';

test.describe('case studies', () => {
  test('the work index lists every project and links to its case study', async ({ page }) => {
    await page.goto('/work');
    await expect(page.getByRole('heading', { level: 1, name: 'Projets' })).toBeVisible();

    const links = page.getByRole('link', { name: /Lire l'étude de cas/ });
    await expect(links).toHaveCount(3);
  });

  test('a homepage project card opens its full case study', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Lire l'étude de cas/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/work\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Le problème')).toBeVisible();
    await expect(page.getByText('La solution')).toBeVisible();
    await expect(page.getByText('Résultats')).toBeVisible();
  });

  test('case study navigation links to another project', async ({ page }) => {
    await page.goto('/work/solane-onboarding');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('facturation');

    await page
      .getByRole('navigation', { name: 'Autres projets' })
      .getByRole('link')
      .first()
      .click();
    await expect(page).toHaveURL(/\/work\/.+/);
    await expect(page).not.toHaveURL(/\/work\/solane-onboarding$/);
  });

  test('an unknown project slug renders the 404 page', async ({ page }) => {
    const response = await page.goto('/work/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('Page introuvable')).toBeVisible();
  });
});
