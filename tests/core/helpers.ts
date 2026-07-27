import crypto from 'crypto';
import { expect, Page } from '@playwright/test';
import {
  attendeePW,
  moderatorPW,
  secret,
  server,
} from './parameters';

type JoinOptions = {
  meetingId: string;
  fullName: string;
  isModerator: boolean;
};

const requireEnvironment = () => {
  if (!server) throw new Error('BBB_URL is not set');
  if (!secret) throw new Error('BBB_SECRET is not set');
};

const checksum = (call: string) => {
  requireEnvironment();
  const algorithm = secret!.length === 64 ? 'sha256' : 'sha1';
  return crypto.createHash(algorithm).update(`${call}${secret}`).digest('hex');
};

export const encodeCustomParams = (parameter: string): string => {
  const [name, ...value] = parameter.split('=');
  return `${name}=${encodeURIComponent(value.join('=')).replace(/%20/g, '+')}`;
};

export async function createMeeting(pluginUrl: string): Promise<string> {
  requireEnvironment();
  const meetingId = `live-transcription-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const pluginParameter = encodeCustomParams(
    `pluginManifests=${JSON.stringify([{ url: pluginUrl }])}`,
  );
  const query = `name=${meetingId}&meetingID=${meetingId}&attendeePW=${attendeePW}`
    + `&moderatorPW=${moderatorPW}&${pluginParameter}`;
  const response = await fetch(`${server}/api/create?${query}&checksum=${checksum(`create${query}`)}`);
  expect(response.ok).toBeTruthy();
  return meetingId;
}

export function getJoinUrl({ meetingId, fullName, isModerator }: JoinOptions): string {
  const password = isModerator ? moderatorPW : attendeePW;
  const query = `fullName=${encodeURIComponent(fullName)}&meetingID=${meetingId}`
    + `&password=${password}&userdata-bbb_show_session_details_on_join=false`;
  return `${server}/api/join?${query}&checksum=${checksum(`join${query}`)}`;
}

export async function closeAudioModal(page: Page): Promise<void> {
  const closeButton = page.locator('button[data-test="closeModal"]');
  if (await closeButton.isVisible()) await closeButton.click();
}

export async function addCaptionLocale(page: Page, locale: string): Promise<void> {
  await page.evaluate((captionLocale) => {
    window.dispatchEvent(new CustomEvent('CAPTION_ADD_LOCALE_COMMAND', {
      detail: captionLocale,
    }));
  }, locale);
}

export async function submitCaption(
  page: Page,
  text: string,
  locale: string,
): Promise<void> {
  await page.evaluate(({ captionText, captionLocale }) => {
    window.dispatchEvent(new CustomEvent('CAPTION_SAVE_COMMAND', {
      detail: {
        text: captionText,
        locale: captionLocale,
        captionType: 'AUDIO_TRANSCRIPTION',
      },
    }));
  }, { captionText: text, captionLocale: locale });
}
