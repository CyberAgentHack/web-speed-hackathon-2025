import path from 'node:path';

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { scrollEntire, waitForImageToLoad, waitForVideoToLoad } from './utils';

const SERIES_ID = 'a78d2740-2da9-49a8-8ec7-52d1f35af0bd';
const FREE_EPISODE_ID = 'c324a466-ad6d-4bf1-aa5f-fab926f1f5d3';
const PREMIUM_EPISODE_ID = 'c428247f-4ad0-43cd-8180-6e8756a4788d';
const BEFORE_PROGRAM_ID = '672f8628-b007-4b8e-ba3a-5addd06b72d3';
const ON_PROGRAM_ID = '8132c96f-d3f3-45c0-bf19-e70cf171a068'; // テストでは12:00が放送中
const AFTER_PROGRAM_ID = '01bda631-53d0-4a34-8cbb-b6e592311ec6';

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
    path: `/series/${SERIES_ID}`,
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'エピソードページ (無料)',
    path: `/episodes/${FREE_EPISODE_ID}`,
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'エピソードページ (プレミアム - 無料ユーザー)',
    path: `/episodes/${PREMIUM_EPISODE_ID}`,
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'エピソードページ (プレミアム - プレミアムユーザー)',
    path: `/episodes/${PREMIUM_EPISODE_ID}`,
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
    path: `/programs/${BEFORE_PROGRAM_ID}`,
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
    },
  },
  {
    name: 'プログラム（放送中）',
    path: `/programs/${ON_PROGRAM_ID}`,
    wait: async (page: Page) => {
      await waitForImageToLoad(page.locator('main img').first());
      await waitForVideoToLoad(page.locator('video').first());
    },
  },
  {
    name: 'プログラム（放送後）',
    path: `/programs/${AFTER_PROGRAM_ID}`,
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
