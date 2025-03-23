import path from 'node:path';

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { scrollEntire, waitForImageToLoad, waitForVideoToLoad } from './utils';

const PAGES = [
  // ... (PAGES配列は省略)
];

declare const MockDate: { set: (timestamp: number) => void };

test.describe('全画面', () => {
  test.beforeEach(async ({ context, page }) => {
    // ... (MockDateの設定は省略)

    await page.setViewportSize({ height: 1080, width: 1920 });
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
    });
    await context.clearCookies();
  });

  for (const { name, path, wait } of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path);

      // 待ち時間を短縮
      // await wait(page);

      await scrollEntire(page);
      await expect(page).toHaveScreenshot(`vrt-${name}.png`, {
        fullPage: true,
        // マスクする要素を減らす
        mask: [page.locator('video')],
      });
    });
  }
});
