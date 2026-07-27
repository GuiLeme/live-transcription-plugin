import { CaptionGraphqlResult } from './types';

type Caption = CaptionGraphqlResult['caption_history'][number];

export const formatCaptionsForDownload = (captions: Caption[]): string => captions
  .map((caption) => (
    `${caption.user.name} (${new Date(caption.createdAt)}): ${caption.captionText}`
  ))
  .join('\n');

export const isNearBottom = (
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
): boolean => scrollHeight - scrollTop <= clientHeight + 50;

export const getAvatarInitials = (name: string): string => name.slice(0, 2);
