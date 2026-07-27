import {
  ReactNode, useEffect, useRef, useState,
} from 'react';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import * as Styled from './styles';
import { CaptionGraphqlResult, LiveTranscriptionSidekickContentProps } from './types';
import { GET_CAPTIONS } from './queries';
import {
  formatCaptionsForDownload,
  getAvatarInitials,
  isNearBottom,
} from './utils';

const intlMessages = defineMessages({
  downloadButtonLabel: {
    id: 'sidekick.panel.downloadButton.label',
    description: 'Label for the download button',
    defaultMessage: 'Download',
  },
  scrollButtonLabel: {
    id: 'sidekick.panel.scrollButton.label',
    description: 'Label for the "Scroll to latest" button',
    defaultMessage: 'Scroll to latest',
  },
  avatarAlternativeText: {
    id: 'sidekick.panel.avatar.alternativeText',
    description: 'Alternative text for avatar image',
    defaultMessage: 'Avatar for user {0}',
  },
});

export function LiveTranscriptionSidekickContent(
  { pluginApi, captionLocale: locale, intl }: LiveTranscriptionSidekickContentProps,
): ReactNode {
  const { data: captions } = pluginApi.useCustomSubscription
    ? pluginApi.useCustomSubscription<CaptionGraphqlResult>(GET_CAPTIONS, {
      variables: {
        locale,
      },
    })
    : { data: null };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [captions]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const nearBottom = isNearBottom(
      container.scrollHeight,
      container.scrollTop,
      container.clientHeight,
    );
    setIsAtBottom(nearBottom);
  };

  const downloadLiveTranscription = () => {
    if (!captions?.caption_history) return;

    const textContent = formatCaptionsForDownload(captions.caption_history);

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const captionsLength = captions?.caption_history ? captions?.caption_history.length : 0;
  return (
    <Styled.Container data-test="liveTranscriptionContainer">
      <Styled.Header>
        <Styled.HeaderTitle data-test="liveTranscriptionHeaderTitle">{locale}</Styled.HeaderTitle>
        <Styled.DownloadButton
          data-test="liveTranscriptionDownloadButton"
          type="button"
          onClick={downloadLiveTranscription}
        >
          {intl.formatMessage(intlMessages.downloadButtonLabel)}
        </Styled.DownloadButton>
      </Styled.Header>
      <Styled.ScrollAreaWrapper>
        <Styled.ScrollArea
          data-test="liveTranscriptionScrollArea"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {captions?.caption_history?.map((c, index) => (
            <Styled.CaptionRow
              hasMarginBottom={index !== captionsLength - 1}
              key={c.captionId}
              data-test="liveTranscriptionCaptionRow"
            >
              <Styled.UserHeader>
                <Styled.UserInfo>
                  {c.user.avatar && c.user.avatar !== '' ? (
                    <Styled.UserAvatarImage
                      alt={intl.formatMessage(
                        intlMessages.avatarAlternativeText,
                        {
                          0: c.user.name,
                        },
                      )}
                      src={c.user.avatar}
                    />
                  ) : (
                    <Styled.UserAvatarInitials background={c.user?.color}>
                      {getAvatarInitials(c.user.name)}
                    </Styled.UserAvatarInitials>
                  )}
                  <Styled.UserName data-test="liveTranscriptionUserName">
                    {c.user.name}
                  </Styled.UserName>
                </Styled.UserInfo>

                <Styled.Timestamp>
                  {new Date(c.createdAt).toLocaleTimeString()}
                </Styled.Timestamp>
              </Styled.UserHeader>

              <Styled.CaptionContent>
                <Styled.CaptionText data-test="liveTranscriptionCaptionText">
                  {c.captionText}
                </Styled.CaptionText>
              </Styled.CaptionContent>
            </Styled.CaptionRow>
          ))}
        </Styled.ScrollArea>
      </Styled.ScrollAreaWrapper>

      {!isAtBottom && (
        <Styled.ScrollButton
          data-test="liveTranscriptionScrollButton"
          type="button"
          onClick={scrollToBottom}
        >
          {intl.formatMessage(intlMessages.scrollButtonLabel)}
        </Styled.ScrollButton>
      )}
    </Styled.Container>
  );
}
