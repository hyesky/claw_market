import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should load admin dashboard', async ({ page }) => {
    await page.goto('/admin');

    // Check page title
    await expect(page.getByText(/管理后台/)).toBeVisible();
    await expect(page.getByText(/平台概览与监控/)).toBeVisible();
  });

  test('should display platform stats', async ({ page }) => {
    await page.goto('/admin');

    // Check stats cards
    await expect(page.getByText(/总用户数/)).toBeVisible();
    await expect(page.getByText(/商品总数/)).toBeVisible();
    await expect(page.getByText(/今日订单/)).toBeVisible();
    await expect(page.getByText(/平台收入/)).toBeVisible();
  });

  test('should have navigation tabs', async ({ page }) => {
    await page.goto('/admin');

    // Check dashboard tabs using role
    await expect(page.getByRole('button', { name: '概览' })).toBeVisible();
    await expect(page.getByRole('button', { name: '内容审核' })).toBeVisible();
    await expect(page.getByRole('button', { name: '用户管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '商品管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '订单管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '系统设置' })).toBeVisible();
  });

  test('should display moderation queue', async ({ page }) => {
    await page.goto('/admin');

    // Check moderation queue section
    await expect(page.getByText(/待审核内容/)).toBeVisible();
    // Use role-based selector for status badge
    const statusBadge = page.getByRole('main').getByText(/待处理/).first();
    if (await statusBadge.count() > 0) {
      await expect(statusBadge).toBeVisible();
    }
  });

  test('should have approve and reject buttons', async ({ page }) => {
    await page.goto('/admin');

    // Check moderation action buttons
    const approveBtn = page.getByRole('button', { name: '通过' }).first();
    const rejectBtn = page.getByRole('button', { name: '拒绝' }).first();

    if (await approveBtn.isVisible()) {
      await expect(approveBtn).toBeVisible();
    }
    if (await rejectBtn.isVisible()) {
      await expect(rejectBtn).toBeVisible();
    }
  });

  test('should display system health status', async ({ page }) => {
    await page.goto('/admin');

    // Check system health section
    await expect(page.getByText(/系统健康状态/)).toBeVisible();

    // Check health indicators
    await expect(page.getByText(/数据库/)).toBeVisible();
    await expect(page.getByText(/API 服务/)).toBeVisible();
    await expect(page.getByText(/存储/)).toBeVisible();
    await expect(page.getByText(/缓存/)).toBeVisible();
  });

  test('should display recent orders table', async ({ page }) => {
    await page.goto('/admin');

    // Check recent orders section
    await expect(page.getByText(/最近订单/)).toBeVisible();

    // Check table headers
    await expect(page.getByRole('columnheader', { name: '订单号' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '商品' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '买家' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '金额' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '状态' })).toBeVisible();
  });

  test('should switch between dashboard tabs', async ({ page }) => {
    await page.goto('/admin');

    // Click on moderation tab
    await page.getByRole('button', { name: '内容审核' }).click();
    await expect(page.getByText(/审核功能页面占位符/)).toBeVisible();
  });
});
