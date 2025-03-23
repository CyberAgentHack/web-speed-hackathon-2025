import { test, expect } from '@playwright/test';
import { waitForImageToLoad } from './utils';

test.describe('認証', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
    });
  });

  test('新規会員登録 -> ログアウト -> ログイン', async ({ page }) => {
    // コンフリクトしないようにテスト用のメールアドレスを生成
    const email = `test.${Date.now()}@example.com`;

    await test.step('サイドバーのログインボタンをクリック', async () => {
      const sidebar = page.getByRole('complementary');
      await sidebar.getByRole('button', { name: 'ログイン' }).click();
    });

    await test.step('ログインダイアログが表示される', async () => {
      const signInDialog = page.getByRole('dialog');
      await expect(signInDialog).toBeVisible();
      const signInDialogPanel = signInDialog.locator('>div');

      await waitForImageToLoad(signInDialogPanel.locator('img').first());
      await expect(signInDialogPanel).toHaveScreenshot('vrt-signIn-dialog.png');
    });

    await test.step('アカウントを新規登録する ボタンをクリック', async () => {
      const signInDialog = page.getByRole('dialog');
      const signUpLink = signInDialog.getByRole('button', { name: 'アカウントを新規登録する' });
      await signUpLink.click();
    });

    await test.step('新規会員登録ダイアログが表示される', async () => {
      const signUpDialog = page.getByRole('dialog');
      await expect(signUpDialog).toBeVisible();
      const signUpDialogPanel = signUpDialog.locator('>div');

      await waitForImageToLoad(signUpDialogPanel.locator('img').first());
      await expect(signUpDialogPanel).toHaveScreenshot('vrt-signUp-dialog.png');
    });

    await test.step('新規会員登録フォームで正しく入力できる', async () => {
      const signUpDialog = page.getByRole('dialog');
      const signUpDialogPanel = page.getByRole('dialog').locator('>div');

      const emailInput = signUpDialogPanel.getByLabel('メールアドレス');
      await emailInput.fill(email);
      const passwordInput = signUpDialogPanel.getByLabel('パスワード');
      await passwordInput.fill('test');
      await signUpDialog.getByRole('button', { name: 'アカウント作成' }).click();

      await expect(signUpDialog).not.toBeVisible();

      const sidebar = page.getByRole('complementary');
      const signOutButton = sidebar.getByRole('button', { name: 'ログアウト' });
      await expect(signOutButton).toBeVisible();
    });

    await test.step('サイドバーのログアウトボタンをクリック', async () => {
      const sidebar = page.getByRole('complementary');
      await sidebar.getByRole('button', { name: 'ログアウト' }).click();
    });

    await test.step('ログアウトダイアログが表示される', async () => {
      const signOutDialog = page.getByRole('dialog');
      await expect(signOutDialog).toBeVisible();
      const signOutDialogPanel = signOutDialog.locator('>div');

      await waitForImageToLoad(signOutDialogPanel.locator('img').first());
      await expect(signOutDialogPanel).toHaveScreenshot('vrt-signOut-dialog.png');
    });

    await test.step('ログアウトを実行', async () => {
      const signOutDialog = page.getByRole('dialog');
      const signOutDialogPanel = signOutDialog.locator('>div');
      await signOutDialogPanel.getByRole('button', { name: 'ログアウト' }).click();

      await expect(signOutDialog).not.toBeVisible();

      const sidebar = page.getByRole('complementary');
      const signInButton = sidebar.getByRole('button', { name: 'ログイン' });
      await expect(signInButton).toBeVisible();
    });

    await test.step('ログインフォームで正しく入力できる', async () => {
      const sidebar = page.getByRole('complementary');
      await sidebar.getByRole('button', { name: 'ログイン' }).click();

      const signInDialog = page.getByRole('dialog');
      const signInDialogPanel = signInDialog.locator('>div');

      const emailInput = signInDialogPanel.getByLabel('メールアドレス');
      await emailInput.fill(email);
      const passwordInput = signInDialogPanel.getByLabel('パスワード');
      await passwordInput.fill('test');
      await signInDialog.getByRole('button', { name: 'ログイン' }).click();

      await expect(signInDialog).not.toBeVisible();

      const signOutButton = sidebar.getByRole('button', { name: 'ログアウト' });
      await expect(signOutButton).toBeVisible();
    });
  });
});
