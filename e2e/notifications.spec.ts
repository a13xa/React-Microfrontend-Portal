import { test, expect } from '@playwright/test';

test.describe('Notifications Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('janis.berzins@portals.lv');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Notifications' }).click();
    await expect(page).toHaveURL(/\/notifications/);
  });

  test('displays notifications list', async ({ page }) => {
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('unread')).toBeVisible();
  });

  test('marks notification as read', async ({ page }) => {
    const markReadButtons = page.getByRole('button', { name: /Mark.*read/i });
    const initialCount = await markReadButtons.count();
    if (initialCount > 0) {
      await markReadButtons.first().click();
      const newCount = await markReadButtons.count();
      expect(newCount).toBeLessThan(initialCount);
    }
  });
});
