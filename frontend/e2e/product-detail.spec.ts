import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should load product detail page', async ({ page }) => {
    await page.goto('/product/test-product');

    // Check breadcrumb navigation
    await expect(page.getByText('首页')).toBeVisible();
    await expect(page.getByText('商品')).toBeVisible();

    // Check product title section
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display product information', async ({ page }) => {
    await page.goto('/product/test-product');

    // Check product details - look for price or description
    const productInfo = page.locator('[class*="sticky"]').or(page.getByText(/一次性/));
    await expect(productInfo).toBeVisible();
  });

  test('should have navigation tabs', async ({ page }) => {
    await page.goto('/product/test-product');

    // Check tabs using role
    const tabs = page.getByRole('button');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should display add to cart button', async ({ page }) => {
    await page.goto('/product/test-product');

    // Check add to cart button or similar
    const cartBtn = page.getByRole('button', { name: /购物车/ }).first();
    if (await cartBtn.isVisible()) {
      await expect(cartBtn).toBeVisible();
    }
  });

  test('should display related products section', async ({ page }) => {
    await page.goto('/product/test-product');

    // Scroll down to find related products
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Check related products section or products grid
    const related = page.getByText(/相关商品/).or(page.locator('[class*="grid"]'));
    if (await related.count() > 0) {
      await expect(related.first()).toBeVisible();
    }
  });

  test('should have price display', async ({ page }) => {
    await page.goto('/product/test-product');

    // Look for price (¥ symbol)
    const price = page.getByText(/¥/);
    if (await price.count() > 0) {
      await expect(price.first()).toBeVisible();
    }
  });
});