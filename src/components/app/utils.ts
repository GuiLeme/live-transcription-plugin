import { CaptionSettingsGraphqlResponse } from './types';

type ActiveLocale = {
  locale: string;
};

type CaptionSettings = CaptionSettingsGraphqlResponse['meeting'][number]['captionSettings'];

export const getUniqueActiveLocales = (activeLocales: ActiveLocale[]): string[] => (
  Array.from(new Set(
    activeLocales
      .map((activeCaptionLocale) => activeCaptionLocale.locale)
      .filter((locale) => locale !== ''),
  ))
);

export const isCaptionEnabled = (captionSettings: CaptionSettings): boolean => (
  captionSettings.audioCaptionEnabled
  && captionSettings.audioCaptionAvailableLanguages.length >= 0
);

export const isLiveTranscriptionDisabled = (disabledFeatures: string[]): boolean => (
  disabledFeatures.includes('liveTranscription')
);
