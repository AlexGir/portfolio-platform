import { expect, test } from '@playwright/test';

test.describe('portfolio landing', () => {
  test('shows the hero and all main sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const name of ['À propos', 'Expertise', 'Projets', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
  });

  test('primary CTA jumps to the projects section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Voir mes études de cas' }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Projets' })).toBeInViewport();
  });

  test('theme toggle switches to dark mode', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    await page
      .getByRole('button', { name: /Activer le thème sombre/ })
      .first()
      .click();
    await expect(html).toHaveClass(/dark/);
  });

  test('exposes the CV as a downloadable PDF', async ({ page }) => {
    await page.goto('/');
    const cv = page.getByRole('link', { name: /Voir mon CV/ }).first();
    await expect(cv).toHaveAttribute('href', '/cv-alexandre-giraud-product-designer.pdf');

    const response = await page.request.get('/cv-alexandre-giraud-product-designer.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('pdf');
  });

  test('has no obvious accessibility landmarks missing', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
  });
});
