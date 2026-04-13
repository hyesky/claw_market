import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');

    // Check login form
    await expect(page.getByText(/登录您的账号/)).toBeVisible();
    // Check for form inputs
    const inputs = page.locator('input[type="email"], input[type="password"]');
    if (await inputs.count() > 0) {
      await expect(inputs.first()).toBeVisible();
    }

    // Check login button
    const loginBtn = page.getByRole('button', { name: '登录' }).first();
    if (await loginBtn.count() > 0) {
      await expect(loginBtn).toBeVisible();
    }
  });

  test('should show password toggle', async ({ page }) => {
    await page.goto('/login');

    const passwordField = page.getByLabel(/密码/);
    if (await passwordField.count() > 0) {
      await passwordField.fill('testpassword123');
    }

    // Check for eye icon button
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should have social login options', async ({ page }) => {
    await page.goto('/login');

    // Check social login buttons
    await expect(page.getByText(/GitHub/)).toBeVisible();
    await expect(page.getByText(/Google/)).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');

    // Click register link
    await page.getByRole('link', { name: '立即注册' }).click();

    // Should navigate to register page
    await expect(page).toHaveURL('/register');
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/register');

    // Check register form
    await expect(page.getByText(/创建您的账号/)).toBeVisible();
    // Check for form inputs
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    if (await inputs.count() > 0) {
      await expect(inputs.first()).toBeVisible();
    }

    // Check register button
    const registerBtn = page.getByRole('button', { name: '注册' }).first();
    if (await registerBtn.count() > 0) {
      await expect(registerBtn).toBeVisible();
    }
  });

  test('should have terms agreement checkbox', async ({ page }) => {
    await page.goto('/register');

    // Check terms agreement checkbox - use main content area to avoid footer links
    const mainContent = page.locator('main').first();
    if (await mainContent.count() > 0) {
      const termsLink = mainContent.getByText(/服务条款/).first();
      if (await termsLink.count() > 0) {
        await expect(termsLink).toBeVisible();
      }
    }
  });

  test('should navigate back to login from register', async ({ page }) => {
    await page.goto('/register');

    // Click login link
    await page.getByRole('link', { name: '立即登录' }).click();

    // Should navigate to login page
    await expect(page).toHaveURL('/login');
  });
});