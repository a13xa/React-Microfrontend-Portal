import { test, expect } from '@playwright/test';

test.describe('Reports Enhanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('liga.ozola@portals.lv');
    await page.getByLabel('Password').fill('operator123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.getByRole('link', { name: /Reports/ }).click();
    await expect(page).toHaveURL(/\/reports/);
  });

  test('displays reports table with data', async ({ page }) => {
    await expect(page.getByLabelText('Data table')).toBeVisible();
    await expect(page.getByText('Q4 Revenue Analysis')).toBeVisible();
  });

  test('has search input', async ({ page }) => {
    const search = page.getByPlaceholder('Search reports...');
    await expect(search).toBeVisible();
  });

  test('filters reports by search', async ({ page }) => {
    await page.getByPlaceholder('Search reports...').fill('Revenue');
    await page.waitForTimeout(500);
    await expect(page.getByText('Q4 Revenue Analysis')).toBeVisible();
  });

  test('has status filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'In Progress' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Failed' })).toBeVisible();
  });

  test('filters by status', async ({ page }) => {
    await page.getByRole('button', { name: 'Failed' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Failed')).toBeVisible();
  });

  test('has sortable column headers', async ({ page }) => {
    const titleHeader = page.getByRole('columnheader', { name: /Title/ });
    await expect(titleHeader).toBeVisible();
    await titleHeader.click();
  });

  test('shows pagination for many reports', async ({ page }) => {
    await expect(page.getByLabelText('Pagination')).toBeVisible();
    await expect(page.getByLabelText('Page 1')).toBeVisible();
  });

  test('navigates between pages', async ({ page }) => {
    const nextBtn = page.getByLabelText('Next page');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await expect(page.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page');
  });

  test('shows total count', async ({ page }) => {
    await expect(page.getByText(/total/)).toBeVisible();
  });
});
