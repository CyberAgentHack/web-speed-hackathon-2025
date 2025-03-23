import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export async function waitForImageToLoad(imageLocator: Locator): Promise<void> {
  await imageLocator.scrollIntoViewIfNeeded();
  await expect(imageLocator).toBeVisible();
  await expect(async () => {
    expect(
      await (
        await imageLocator.evaluateHandle((element, prop) => {
          if (!(element instanceof HTMLImageElement)) {
            throw new Error('Element is not an image');
          }
          return element[prop as keyof typeof element];
        }, 'naturalWidth')
      ).jsonValue(),
    ).toBeGreaterThan(0);
  }).toPass();
}

export async function waitForVideoToLoad(videoLocator: Locator): Promise<void> {
  // メタデータが読み込まれれば、動画のサイズが取得できる
  await videoLocator.evaluate((video) => {
    if (!(video instanceof HTMLVideoElement)) {
      throw new Error('Element is not a video');
    }
    return new Promise((resolve) => {
      if (video.readyState >= 1) {
        resolve(null);
        return;
      }

      video.addEventListener('loadedmetadata', () => {
        resolve(null);
      });
    });
  });
}

export async function waitForAllImagesToLoad(locator: Locator, expectedNumberOfImages: number = 1): Promise<void> {
  const images = locator.locator('img');

  await expect(async () => {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await expect(images.count()).resolves.toBeGreaterThanOrEqual(expectedNumberOfImages);
  }).toPass();

  const count = await images.count();
  for (let i = 0; i < count; i++) {
    await waitForImageToLoad(images.nth(i));
  }
}

export async function scrollEntire(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await delay(50);
    }

    for (let i = document.body.scrollHeight; i > 0; i -= 100) {
      window.scrollTo(0, i);
      await delay(50);
    }
  });
}
