import { describe, expect, it } from 'vitest';
import {
  formatCaptionsForDownload,
  getAvatarInitials,
  isNearBottom,
} from '../../src/components/sidekick-content/utils';

const captions = [{
  user: { avatar: '', color: '#000000', name: 'Alice' },
  captionText: 'Hello',
  captionId: 'caption-1',
  createdAt: '2026-07-27T12:34:56.000Z',
}];

describe('formatCaptionsForDownload', () => {
  it('preserves the current downloadable text format', () => {
    expect(formatCaptionsForDownload(captions))
      .toBe(`Alice (${new Date(captions[0].createdAt)}): Hello`);
  });

  it('joins captions with newlines', () => {
    expect(formatCaptionsForDownload([
      ...captions,
      {
        ...captions[0],
        captionId: 'caption-2',
        captionText: 'World',
      },
    ])).toContain('\nAlice (');
  });
});

describe('isNearBottom', () => {
  it('allows the existing 50px threshold', () => {
    expect(isNearBottom(1000, 451, 500)).toBe(true);
    expect(isNearBottom(1000, 449, 500)).toBe(false);
  });
});

describe('getAvatarInitials', () => {
  it('returns the first two characters without changing case', () => {
    expect(getAvatarInitials('Alice')).toBe('Al');
    expect(getAvatarInitials('É')).toBe('É');
  });
});
