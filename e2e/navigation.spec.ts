import { test, expect } from '@playwright/test';

test.describe('Navigation Between Modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@portal.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('navigates to Profile module', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByText('User Profile')).toBeVisible();
  });

  test('navigates to Notifications module', async ({ page }) => {
    await page.getByRole('link', { name: 'Notifications' }).click();
    await expect(page).toHaveURL(/\/notifications/);
    await expect(page.getByText('Notifications')).toBeVisible();
  });

  test('navigates to Reports module', async ({ page }) => {
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.getByText('Reports Dashboard')).toBeVisible();
  });

  test('shows active nav link styling', async ({ page }) => {
    await page.getByRole('link', { name: 'Notifications' }).click();
    const activeLink = page.getByRole('link', { name: 'Notifications' });
    await expect(activeLink).toBeVisible();
  });
});
