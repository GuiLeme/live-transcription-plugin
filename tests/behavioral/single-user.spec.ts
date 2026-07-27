import { expect, test } from '@playwright/test';
import { resolvePluginUrl } from '../core/fixtures/pluginBeforeAll';
import { Plugin } from '../core/plugin';
import {
  addCaptionLocale,
  submitCaption,
} from '../core/helpers';
import { elements as e } from '../elements';

test('shows and downloads a caption submitted through the BBB caption command path', async ({
  browser,
  request,
}) => {
  const plugin = new Plugin(browser);
  await plugin.initialize(await resolvePluginUrl(request));
  const { page } = plugin.modPage;
  const captionText = 'Caption submitted through the BBB command path';

  await addCaptionLocale(page, 'en-US');
  await expect(page.locator(e.sidekickMenuItem)).toBeVisible();
  await submitCaption(page, captionText, 'en-US');
  await page.locator(e.sidekickMenuItem).click();

  await expect(page.locator(e.captionRow)).toHaveCount(1);
  await expect(page.locator(e.userName)).toHaveText('Moderator');
  await expect(page.locator(e.captionText)).toHaveText(captionText);

  const downloadPromise = page.waitForEvent('download');
  await page.locator(e.downloadButton).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('captions.txt');

  await plugin.modPage.close();
});
