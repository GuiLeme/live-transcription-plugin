import { expect, test } from '@playwright/test';
import { resolvePluginUrl } from '../core/fixtures/pluginBeforeAll';
import { Plugin } from '../core/plugin';
import { SessionPage } from '../core/sessionPage';
import {
  addCaptionLocale,
  submitCaption,
} from '../core/helpers';
import { elements as e } from '../elements';

test('synchronizes a caption between moderator and attendee sidekick panels', async ({
  browser,
  request,
}) => {
  const pluginUrl = await resolvePluginUrl(request);
  const plugin = new Plugin(browser);
  await plugin.initialize(pluginUrl);

  const attendee = new SessionPage(browser);
  attendee.meetingId = plugin.modPage.meetingId;
  await attendee.join('Attendee', false);

  const captionText = 'Caption synchronized to both participants';
  await addCaptionLocale(plugin.modPage.page, 'en-US');
  await submitCaption(plugin.modPage.page, captionText, 'en-US');

  await expect(plugin.modPage.page.locator(e.sidekickMenuItem)).toBeVisible();
  await expect(attendee.page.locator(e.sidekickMenuItem)).toBeVisible();
  await plugin.modPage.page.locator(e.sidekickMenuItem).click();
  await attendee.page.locator(e.sidekickMenuItem).click();

  await expect(plugin.modPage.page.locator(e.captionText)).toHaveText(captionText);
  await expect(attendee.page.locator(e.captionText)).toHaveText(captionText);
  await expect(attendee.page.locator(e.userName)).toHaveText('Moderator');

  await attendee.close();
  await plugin.modPage.close();
});
