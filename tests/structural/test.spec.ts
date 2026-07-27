import { expect, test } from '@playwright/test';
import { resolvePluginUrl } from '../core/fixtures/pluginBeforeAll';
import { Plugin } from '../core/plugin';
import { addCaptionLocale } from '../core/helpers';
import { elements as e } from '../elements';

test('renders the live transcription sidekick structure', async ({ browser, request }) => {
  const plugin = new Plugin(browser);
  await plugin.initialize(await resolvePluginUrl(request));
  const { page } = plugin.modPage;

  await addCaptionLocale(page, 'en-US');
  await expect(page.locator(e.sidekickMenuItem)).toContainText('Live Transcription (en-US)');
  await page.locator(e.sidekickMenuItem).click();

  await expect(page.locator(e.container)).toBeVisible();
  await expect(page.locator(e.headerTitle)).toHaveText('en-US');
  await expect(page.locator(e.downloadButton)).toHaveText('Download');
  await expect(page.locator(e.scrollArea)).toBeVisible();

  await plugin.modPage.close();
});
