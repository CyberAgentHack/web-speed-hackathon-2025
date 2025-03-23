import { expect, test } from '@playwright/test';

import { waitForImageToLoad } from './utils';

test.describe('サービストップ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
    });
  });

  test('サイドバーにロゴ画像が表示されていること', async ({ page }) => {
    // ロケータの最適化
    const heroImg = page.locator('#heroImage');

    // 待ち時間を短縮
    // await waitForImageToLoad(heroImg);

    await expect(heroImg).toHaveScreenshot('vrt-hero-img.png');
  });
});
