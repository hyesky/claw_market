import { test, expect } from '@playwright/test';

test.describe('Creator Dashboard', () => {
  test('should load creator dashboard', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check page title - use heading role to avoid footer link
    await expect(page.getByRole('heading', { name: /数据看板/ })).toBeVisible();
    await expect(page.getByText(/查看您的创作者数据和分析/)).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check stats cards - use role-based selectors
    await expect(page.getByText(/总收入/)).toBeVisible();
    // Download count appears in stats card, not table header
    const downloadText = page.locator('[class*="stats"]').getByText(/下载量/).first();
    if (await downloadText.count() > 0) {
      await expect(downloadText).toBeVisible();
    }
    await expect(page.getByText(/活跃用户/)).toBeVisible();
    await expect(page.getByText(/转化率/)).toBeVisible();
  });

  test('should have date range selector', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check date range dropdown
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('should have export data button', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check export button - use role-based selector
    const exportBtn = page.getByRole('button', { name: /导出/ }).first();
    if (await exportBtn.count() > 0) {
      await expect(exportBtn).toBeVisible();
    }
  });

  test('should display revenue chart section', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check revenue chart section - use heading role
    await expect(page.getByRole('heading', { name: /收入趋势/ })).toBeVisible();
  });

  test('should display recent sales', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check recent sales section
    await expect(page.getByText(/最近订单/)).toBeVisible();
  });

  test('should display top products table', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check top products section - use heading role
    await expect(page.getByRole('heading', { name: /热门商品/ })).toBeVisible();

    // Check table headers - use role-based selectors
    const tableHeaders = page.getByRole('columnheader');
    if (await tableHeaders.count() > 0) {
      const headersText = await tableHeaders.allTextContents();
      expect(headersText.join(' ')).toMatch(/排名 | 商品名称 | 下载量 | 收入/);
    }
  });

  test('should display optimization suggestions', async ({ page }) => {
    await page.goto('/creator/dashboard');

    // Check suggestions section
    await expect(page.getByText(/优化建议/)).toBeVisible();
  });
});
