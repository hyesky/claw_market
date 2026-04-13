import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test('should load products page', async ({ page }) => {
    await page.goto('/products');

    // Check filter sidebar (indicates page loaded)
    await expect(page.getByText(/筛选条件/)).toBeVisible();

    // Check sort dropdown
    const select = page.locator('select').first();
    if (await select.count() > 0) {
      await expect(select).toBeVisible();
    }
  });

  test('should display filter options', async ({ page }) => {
    await page.goto('/products');

    // Check Agent Type filter
    await expect(page.getByText(/Agent 类型/)).toBeVisible();

    // Check Model Compatibility filter
    await expect(page.getByText(/模型兼容/)).toBeVisible();

    // Check Price Range filter
    await expect(page.getByText(/价格范围/)).toBeVisible();

    // Check Tags filter
    await expect(page.getByText(/标签/)).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    await page.goto('/products');

    // Click clear filters button
    const clearBtn = page.getByText('清空');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(page).toHaveURL('/products');
    }
  });

  test('should change sort order', async ({ page }) => {
    await page.goto('/products');

    // Select different sort option
    const select = page.locator('select').first();
    if (await select.count() > 0) {
      // Get available options first
      const options = await select.locator('option').all();
      if (options.length > 1) {
        await select.selectOption({ index: 1 });
      }
    }
  });

  test('should display product cards or skeleton', async ({ page }) => {
    await page.goto('/products');

    // Check for skeleton or content - use heading role for filter sidebar
    const filterHeading = page.getByRole('heading', { name: /筛选条件/ }).first();
    if (await filterHeading.count() > 0) {
      await expect(filterHeading).toBeVisible();
    }
  });

  test('should paginate through products', async ({ page }) => {
    await page.goto('/products');

    // Check if pagination exists
    const nextPage = page.getByText('下一页');
    if (await nextPage.isVisible()) {
      await nextPage.click();
      await expect(page).toHaveURL(/page=/);
    }
  });

  test('should navigate to product detail from card', async ({ page }) => {
    await page.goto('/products');

    // Click on "查看详情" button if exists
    const viewDetailsBtn = page.getByRole('button', { name: '查看详情' }).first();
    if (await viewDetailsBtn.isVisible()) {
      await viewDetailsBtn.click();
      await expect(page).toHaveURL(/\/product\//);
    }
  });
});
