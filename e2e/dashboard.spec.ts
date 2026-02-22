import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('janis.berzins@portals.lv');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('displays welcome message with user name', async ({ page }) => {
    await expect(page.getByText('Welcome back, Jānis')).toBeVisible();
  });

  test('shows overview metrics', async ({ page }) => {
    await expect(page.getByText('Unread notifications')).toBeVisible();
    await expect(page.getByText('Active users')).toBeVisible();
    await expect(page.getByText('Pending approvals')).toBeVisible();
    await expect(page.getByText('Compliance score')).toBeVisible();
  });

  test('has working tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Recent Activity/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Report Status/ })).toBeVisible();

    await page.getByRole('tab', { name: /Report Status/ }).click();
    await expect(page.getByText('Completed')).toBeVisible();
  });

  test('shows navigation buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reports' })).toBeVisible();
  });

  test('navigates to notifications', async ({ page }) => {
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page).toHaveURL(/\/notifications/);
  });

  test('shows system uptime', async ({ page }) => {
    await expect(page.getByText(/uptime/i)).toBeVisible();
  });
});
