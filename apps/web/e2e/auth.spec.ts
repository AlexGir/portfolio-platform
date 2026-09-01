import { expect, test } from '@playwright/test';

test.describe('authentication entry points', () => {
  test('login page offers both providers pointing at the API', async ({ page }) => {
    await page.goto('/login');

    const github = page.getByRole('link', { name: 'Continuer avec GitHub' });
    const google = page.getByRole('link', { name: 'Continuer avec Google' });

    await expect(github).toHaveAttribute('href', 'http://localhost:4000/auth/github');
    await expect(google).toHaveAttribute('href', 'http://localhost:4000/auth/google');
  });

  test('the header "Espace" link leads to the login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Espace' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('the dashboard redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
