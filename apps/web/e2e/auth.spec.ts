import { expect, test } from '@playwright/test';

test.describe('authentication entry points', () => {
  test('login page offers both providers pointing at the API', async ({ page }) => {
    await page.goto('/login');

    const github = page.getByRole('link', { name: 'Continuer avec GitHub' });
    const google = page.getByRole('link', { name: 'Continuer avec Google' });

    await expect(github).toHaveAttribute('href', 'http://localhost:4000/auth/github');
    await expect(google).toHaveAttribute('href', 'http://localhost:4000/auth/google');
  });

  test('the public site does not advertise the login page', async ({ page }) => {
    await page.goto('/');
    // The dashboard is private; visitors get the CV instead of a login entry point.
    await expect(page.locator('header').getByRole('link', { name: /Espace/ })).toHaveCount(0);
    await expect(page.locator('a[href="/login"]')).toHaveCount(0);
  });

  test('the login page stays reachable by direct URL', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Continuer avec GitHub' })).toBeVisible();
  });

  test('the dashboard redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
