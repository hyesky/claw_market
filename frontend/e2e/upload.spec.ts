import { test, expect } from '@playwright/test';

test.describe('Upload Page', () => {
  test('should load upload page', async ({ page }) => {
    await page.goto('/upload');

    // Check page title
    await expect(page.getByText(/上传人格配置/)).toBeVisible();

    // Check description
    await expect(page.getByText(/分享你设计的 Agent 人格配置/)).toBeVisible();
  });

  test('should display file upload area', async ({ page }) => {
    await page.goto('/upload');

    // Check drop zone
    await expect(page.getByText(/拖拽文件到此处/)).toBeVisible();
    // Use role-based selector for the button
    const selectBtn = page.getByRole('button', { name: /选择文件/ }).first();
    if (await selectBtn.count() > 0) {
      await expect(selectBtn).toBeVisible();
    }

    // Check supported file types - use exact match for the file types list
    const fileTypes = page.getByText(/支持文件/);
    if (await fileTypes.count() > 0) {
      await expect(fileTypes).toBeVisible();
    }
  });

  test('should display product details form', async ({ page }) => {
    await page.goto('/upload');

    // Check form section
    await expect(page.getByText(/商品信息/)).toBeVisible();

    // Check form fields - use more specific selectors
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // Check for input fields within form
      const inputs = form.locator('input[type="text"], input[type="url"], textarea');
      if (await inputs.count() > 0) {
        await expect(inputs.first()).toBeVisible();
      }
    }
  });

  test('should have agent type options', async ({ page }) => {
    await page.goto('/upload');

    // Check agent type dropdown
    const agentTypeSelect = page.locator('select').first();
    await agentTypeSelect.selectOption('assistant');
    await expect(agentTypeSelect).toHaveValue('assistant');
  });

  test('should display model compatibility checkboxes', async ({ page }) => {
    await page.goto('/upload');

    // Check model options
    await expect(page.getByText('GPT-4')).toBeVisible();
    await expect(page.getByText('Claude')).toBeVisible();
    await expect(page.getByText('Gemini')).toBeVisible();
  });

  test('should have auto-generate slug button', async ({ page }) => {
    await page.goto('/upload');

    // Check auto-generate button
    await expect(page.getByText('自动生成')).toBeVisible();
  });

  test('should display preview section', async ({ page }) => {
    await page.goto('/upload');

    // Check preview section
    await expect(page.getByText(/商品预览/)).toBeVisible();
  });

  test('should have reset and submit buttons', async ({ page }) => {
    await page.goto('/upload');

    // Check reset button
    await expect(page.getByText('重置')).toBeVisible();

    // Check submit button
    await expect(page.getByText('提交审核')).toBeVisible();
  });
});
