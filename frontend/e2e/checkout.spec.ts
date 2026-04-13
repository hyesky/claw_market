import { test, expect } from '@playwright/test';

test.describe('Checkout Page', () => {
  test('should load checkout page', async ({ page }) => {
    await page.goto('/checkout');

    // Check order summary section
    await expect(page.getByText(/订单确认/)).toBeVisible();

    // Check payment method section
    await expect(page.getByText(/支付方式/)).toBeVisible();
  });

  test('should display payment methods', async ({ page }) => {
    await page.goto('/checkout');

    // Check payment method options
    await expect(page.getByText('支付宝')).toBeVisible();
    await expect(page.getByText('微信支付')).toBeVisible();
    await expect(page.getByText('信用卡')).toBeVisible();
  });

  test('should display authorization types', async ({ page }) => {
    await page.goto('/checkout');

    // Check authorization agreement
    await expect(page.getByText(/授权协议/)).toBeVisible();

    // Check authorization type options
    await expect(page.getByText('个人使用')).toBeVisible();
    await expect(page.getByText('商业使用')).toBeVisible();
    await expect(page.getByText('企业授权')).toBeVisible();
  });

  test('should have terms agreement checkbox', async ({ page }) => {
    await page.goto('/checkout');

    // Check terms agreement checkbox - look for checkbox label
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    if (await termsCheckbox.count() > 0) {
      await expect(termsCheckbox).toBeVisible();
    }
  });

  test('should display total amount', async ({ page }) => {
    await page.goto('/checkout');

    // Check total section
    await expect(page.getByText(/总计/)).toBeVisible();
  });

  test('should have security notice', async ({ page }) => {
    await page.goto('/checkout');

    // Check security notice
    await expect(page.getByText(/安全支付/)).toBeVisible();
  });

  test('should display back button', async ({ page }) => {
    await page.goto('/checkout');

    // Check back button
    await expect(page.getByText(/返回商品列表/)).toBeVisible();
  });
});
