import { Browser } from '@playwright/test';
import { SessionPage } from './sessionPage';

export class Plugin {
  readonly browser: Browser;

  modPage: SessionPage;

  constructor(browser: Browser) {
    this.browser = browser;
    this.modPage = new SessionPage(browser);
  }

  async initialize(pluginUrl: string): Promise<void> {
    await this.modPage.create(pluginUrl);
  }
}
