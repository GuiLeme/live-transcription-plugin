import { describe, expect, it } from 'vitest';
import {
  getUniqueActiveLocales,
  isCaptionEnabled,
  isLiveTranscriptionDisabled,
} from '../../src/components/app/utils';

describe('getUniqueActiveLocales', () => {
  it('deduplicates locales while preserving their first-seen order', () => {
    expect(getUniqueActiveLocales([
      { locale: 'en-US' },
      { locale: 'pt-BR' },
      { locale: 'en-US' },
    ])).toEqual(['en-US', 'pt-BR']);
  });

  it('filters empty locale values', () => {
    expect(getUniqueActiveLocales([{ locale: '' }, { locale: 'fr-FR' }]))
      .toEqual(['fr-FR']);
  });
});

describe('caption permissions', () => {
  it('enables captions when audio captions are enabled and languages are present', () => {
    expect(isCaptionEnabled({
      audioCaptionEnabled: true,
      audioCaptionAvailableLanguages: ['en-US'],
    })).toBe(true);
  });

  it('preserves the current behavior for an empty language list', () => {
    expect(isCaptionEnabled({
      audioCaptionEnabled: true,
      audioCaptionAvailableLanguages: [],
    })).toBe(true);
  });

  it('disables captions when audio captions are disabled', () => {
    expect(isCaptionEnabled({
      audioCaptionEnabled: false,
      audioCaptionAvailableLanguages: ['en-US'],
    })).toBe(false);
  });

  it('detects the live-transcription disabled feature', () => {
    expect(isLiveTranscriptionDisabled(['chat', 'liveTranscription'])).toBe(true);
    expect(isLiveTranscriptionDisabled(['chat'])).toBe(false);
  });
});
