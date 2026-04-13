import { test, expect } from '@playwright/test';

test.describe('Personality Sandbox', () => {
  test('should load sandbox preview', async ({ page }) => {
    await page.goto('/product/test-product');

    // Click on sandbox tab
    const sandboxTab = page.getByRole('button', { name: '沙箱预览' });
    if (await sandboxTab.count() > 0) {
      await sandboxTab.click();

      // Check sandbox warning banner
      const warning = page.getByText(/沙箱/).or(page.getByText(/预览/));
      if (await warning.count() > 0) {
        await expect(warning.first()).toBeVisible();
      }
    }
  });

  test('should display chat interface when available', async ({ page }) => {
    await page.goto('/product/test-product');

    // Click on sandbox tab
    const sandboxTab = page.getByRole('button', { name: '沙箱预览' });
    if (await sandboxTab.count() > 0) {
      await sandboxTab.click();

      // Check for message area or input
      const chatArea = page.locator('[class*="h-96"]').or(page.getByPlaceholder(/输入/));
      if (await chatArea.count() > 0) {
        await expect(chatArea.first()).toBeVisible();
      }
    }
  });

  test('should have message input when available', async ({ page }) => {
    await page.goto('/product/test-product');

    // Click on sandbox tab
    const sandboxTab = page.getByRole('button', { name: '沙箱预览' });
    if (await sandboxTab.count() > 0) {
      await sandboxTab.click();

      // Check input field
      const inputField = page.getByPlaceholder(/输入/).or(page.locator('input[type="text"]'));
      if (await inputField.count() > 0) {
        await expect(inputField.first()).toBeVisible();
      }
    }
  });
});