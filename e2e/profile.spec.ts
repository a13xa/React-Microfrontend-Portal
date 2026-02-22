import { test, expect } from '@playwright/test';

test.describe('Profile Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@portal.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('displays user profile information', async ({ page }) => {
    await expect(page.getByText('User Profile')).toBeVisible();
    await expect(page.getByText('Edit Profile')).toBeVisible();
  });

  test('enters edit mode and cancels', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible();
  });

  test('edits profile and saves', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill('Updated Name');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Updated Name')).toBeVisible();
  });
});
