import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export async function waitForImageToLoad(imageLocator: Locator): Promise<void> {
  await imageLocator.scrollIntoViewIfNeeded();
  await expect(imageLocator).toBeVisible();
  await expect(async () => {
    const naturalWidth = await imageLocator.evaluate((element) => {
      if (!(element instanceof HTMLImageElement)) {
        throw new Error('Element is not an image');
      }
      return element.naturalWidth;
    });
    expect(naturalWidth).toBeGreaterThan(0);
  }).toPass();
}

export async function waitForVideoToLoad(videoLocator: Locator): Promise<void> {
  await videoLocator.evaluate((video) => {
    if (!(video instanceof HTMLVideoElement)) {
      throw new Error('Element is not a video');
    }
    if (video.readyState >= 1) {
      return;
    }
    return new Promise((resolve) => {
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
  const imagePromises = [];
  for (let i = 0; i < count; i++) {
    imagePromises.push(waitForImageToLoad(images.nth(i)));
  }
  await Promise.all(imagePromises);
}

export async function scrollEntire(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const scrollStep = 200;
    const scrollDelay = 10;

    const scroll = (y: number) => {
      return new Promise<void>((resolve) => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => {
          setTimeout(resolve, scrollDelay);
        });
      });
    };

    for (let i = 0; i < document.body.scrollHeight; i += scrollStep) {
      await scroll(i);
    }

    for (let i = document.body.scrollHeight; i > 0; i -= scrollStep) {
      await scroll(i);
    }
  });
}
