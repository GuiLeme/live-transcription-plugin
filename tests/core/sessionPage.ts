import {
  Browser,
  BrowserContext,
  expect,
  Page,
} from '@playwright/test';
import { ELEMENT_WAIT_EXTRA_LONG_TIME } from './constants';
import {
  closeAudioModal,
  createMeeting,
  getJoinUrl,
} from './helpers';

export class SessionPage {
  readonly browser: Browser;

  context!: BrowserContext;

  page!: Page;

  meetingId = '';

  constructor(browser: Browser) {
    this.browser = browser;
  }

  async create(pluginUrl: string, fullName = 'Moderator'): Promise<void> {
    this.meetingId = await createMeeting(pluginUrl);
    await this.join(fullName, true);
  }

  async join(fullName: string, isModerator: boolean): Promise<void> {
    this.context = await this.browser.newContext({
      recordVideo: {
        dir: 'test-results/videos',
        size: { width: 1280, height: 720 },
      },
    });
    this.page = await this.context.newPage();
    const response = await this.page.goto(getJoinUrl({
      meetingId: this.meetingId,
      fullName,
      isModerator,
    }));
    expect(response?.ok()).toBeTruthy();
    await this.page.waitForSelector('div#layout', { timeout: ELEMENT_WAIT_EXTRA_LONG_TIME });
    await closeAudioModal(this.page);
  }

  async close(): Promise<void> {
    await this.context?.close();
  }
}
