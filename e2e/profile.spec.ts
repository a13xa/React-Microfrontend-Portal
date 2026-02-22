import { test, expect } from '@playwright/test';

test.describe('Profile Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('janis.berzins@portals.lv');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('displays user profile information', async ({ page }) => {
    await expect(page.getByText('Full name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('enters edit mode and cancels', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('edits profile and saves', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill('Updated Name');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Updated Name').first()).toBeVisible();
  });
});
