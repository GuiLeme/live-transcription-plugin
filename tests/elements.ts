import { coreElements } from './core/coreElements';

export const elements = {
  ...coreElements,
  sidekickMenuItem: '[data-test="sidekick_menu_item_undefined"]',
  container: '[data-test="liveTranscriptionContainer"]',
  headerTitle: '[data-test="liveTranscriptionHeaderTitle"]',
  downloadButton: '[data-test="liveTranscriptionDownloadButton"]',
  scrollArea: '[data-test="liveTranscriptionScrollArea"]',
  captionRow: '[data-test="liveTranscriptionCaptionRow"]',
  userName: '[data-test="liveTranscriptionUserName"]',
  captionText: '[data-test="liveTranscriptionCaptionText"]',
  scrollButton: '[data-test="liveTranscriptionScrollButton"]',
};
