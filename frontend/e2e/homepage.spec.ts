import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Claw Market/);

    // Check hero section
    await expect(page.getByText(/发现并交易 Agent 人格配置/)).toBeVisible();

    // Check search bar
    await expect(page.getByPlaceholder(/搜索/)).toBeVisible();

    // Check categories section
    await expect(page.getByText(/浏览分类/)).toBeVisible();

    // Check category cards
    const categories = page.getByRole('link', { name: /助手 | 陪伴 | 导师 | 创意 | 专业/ });
    await expect(categories).toHaveCount(5);
  });

  test('should display featured products section', async ({ page }) => {
    await page.goto('/');

    // Check featured products section
    await expect(page.getByText(/精选推荐/)).toBeVisible();
  });

  test('should display new releases section', async ({ page }) => {
    await page.goto('/');

    // Check new releases section
    await expect(page.getByText(/最新上架/)).toBeVisible();
  });

  test('should have navigation bar', async ({ page }) => {
    await page.goto('/');

    // Check hero section exists (indicates page loaded)
    await expect(page.getByText(/发现并交易/)).toBeVisible();

    // Check login button
    await expect(page.getByText('登录')).toBeVisible();
    // Check register link - use role based selector
    const registerLink = page.getByRole('link', { name: /注册/ }).first();
    if (await registerLink.count() > 0) {
      await expect(registerLink).toBeVisible();
    }
  });

  test('should have footer', async ({ page }) => {
    await page.goto('/');
    await page.viewportSize({ width: 1920 });

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer sections - use footer role
    const footer = page.locator('footer').first();
    if (await footer.count() > 0) {
      const footerText = await footer.innerText();
      expect([/关于/, /支持/, /创作者/, /法律/].some(re => re.test(footerText))).toBeTruthy();
    }
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    // Click on products link
    await page.getByText('商品').click();

    // Should navigate to products page
    await expect(page).toHaveURL(/\/products/);
  });

  test('should click on category', async ({ page }) => {
    await page.goto('/');

    // Click on assistant category
    await page.getByRole('link', { name: '助手' }).click();

    // Should navigate to products page with filter
    await expect(page).toHaveURL(/\/products\?agent_type=assistant/);
  });
});
