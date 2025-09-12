export const GET_CAPTION_ACTIVE_LOCALES = `
subscription getCaptionLocale {
  caption_activeLocales {
    locale
  }
}
`;

export const GET_CAPTION_SETTINGS = `
query captionInformation {
  meeting {
    disabledFeatures
    captionSettings: clientSettings {
      audioCaptionEnabled: clientSettingsJson(path: "public.app.audioCaptions.enabled")
      audioCaptionAvailableLanguages: clientSettingsJson(path: "public.app.audioCaptions.language.available")
    }
  }
}
`;
