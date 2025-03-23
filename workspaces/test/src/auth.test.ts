import { test, expect } from '@playwright/test';

test.describe('認証', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
    });
  });

  test('新規会員登録 -> ログアウト -> ログイン', async ({ page }) => {
    const email = `test.${Date.now()}@example.com`;

    // ロケータの最適化例
    const sidebarLoginButton = page.locator('#sidebarLoginButton');
    const signInDialog = page.locator('#signInDialog');
    const signUpDialog = page.locator('#signUpDialog');
    const signOutDialog = page.locator('#signOutDialog');

    await test.step('サイドバーのログインボタンをクリック', async () => {
      await sidebarLoginButton.click();
    });

    await test.step('ログインダイアログが表示される', async () => {
      await expect(signInDialog).toBeVisible();
      const signInDialogPanel = signInDialog.locator('>div');

      // 画像読み込みの待ち時間を短縮
       await waitForImageToLoad(signInDialogPanel.locator('img').first());
      await expect(signInDialogPanel).toHaveScreenshot('vrt-signIn-dialog.png');
    });

    await test.step('アカウントを新規登録する ボタンをクリック', async () => {
      const signUpLink = signInDialog.getByRole('button', { name: 'アカウントを新規登録する' });
      await signUpLink.click();
    });

    await test.step('新規会員登録ダイアログが表示される', async () => {
      await expect(signUpDialog).toBeVisible();
      const signUpDialogPanel = signUpDialog.locator('>div');

      // 画像読み込みの待ち時間を短縮
       await waitForImageToLoad(signUpDialogPanel.locator('img').first());
      await expect(signUpDialogPanel).toHaveScreenshot('vrt-signUp-dialog.png');
    });

    await test.step('新規会員登録フォームで正しく入力できる', async () => {
      const signUpDialogPanel = signUpDialog.locator('>div');

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
      await expect(signOutDialog).toBeVisible();
      const signOutDialogPanel = signOutDialog.locator('>div');

      await waitForImageToLoad(signOutDialogPanel.locator('img').first());
      await expect(signOutDialogPanel).toHaveScreenshot('vrt-signOut-dialog.png');
    });

    await test.step('ログアウトを実行', async () => {
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
