import path from 'node:path';

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { scrollEntire, waitForImageToLoad, waitForVideoToLoad } from './utils';

const PAGES = [
  {
    name: 'トップページ',
    path: '/',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'シリーズページ',
    path: '/series/b44c9e84-2f62-4670-97c4-40f710489d66',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'エピソードページ (無料)',
    path: '/episodes/89895c59-0c51-42f4-abb6-53fa86bdc4a2',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'エピソードページ (プレミアム - 無料ユーザー)',
    path: '/episodes/d16a4428-9c25-4ae2-8c5a-d841ab5998b0',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'エピソードページ (プレミアム - プレミアムユーザー)',
    path: '/episodes/d16a4428-9c25-4ae2-8c5a-d841ab5998b0',
    wait: async (page: Page) => {
      // コンフリクトしないようにテスト用のメールアドレスを生成
      const email = `test.${Date.now()}@example.com`;
      const sidebar = page.getByRole('complementary');
      await sidebar.getByRole('button', { name: 'ログイン' }).click();

      const signInDialog = page.getByRole('dialog');
      const signUpLink = signInDialog.getByRole('button', { name: 'アカウントを新規登録する' });
      await signUpLink.click();

      const signUpDialog = page.getByRole('dialog');
      const signUpDialogPanel = signUpDialog.locator('>div');

      const emailInput = signUpDialogPanel.getByLabel('メールアドレス');
      await emailInput.fill(email);
      const passwordInput = signUpDialogPanel.getByLabel('パスワード');
      await passwordInput.fill('test');
      await signUpDialog.getByRole('button', { name: 'アカウント作成' }).click();

      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'プログラム（放送前）',
    path: '/programs/e34e75d8-e07f-4517-ba3d-9c09eba2bd3a',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'プログラム（放送中）',
    path: '/programs/5f8521b0-1aaf-4949-a54d-e2da710dc972',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'プログラム（放送後）',
    path: '/programs/d3c78d58-bf4f-4445-9577-af9759a4af78',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: '番組表',
    path: '/timetable',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: '404',
    path: '/404',
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
];

declare const MockDate: { set: (timestamp: number) => void };

test.describe('全画面', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addInitScript({
      path: path.join(__dirname, '..', 'node_modules', 'mockdate', 'lib', 'mockdate.js'),
    });
    await context.addInitScript(() => {
      const now = new Date();
      now.setHours(12, 0, 0, 0); // 12:00:00 で固定

      MockDate.set(now.getTime());
    });

    await page.setViewportSize({ height: 1080, width: 1920 });
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
    });
    await context.clearCookies();
  });

  for (const { name, path, wait } of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path);
      await wait(page);
      await scrollEntire(page);
      await expect(page).toHaveScreenshot(`vrt-${name}.png`, {
        fullPage: true,
        mask: [page.locator('video'), page.locator("//img[contains(@src, '.gif')]")],
      });
    });
  }
});
