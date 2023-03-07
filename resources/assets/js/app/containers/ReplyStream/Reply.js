import React from 'react';
import styled from 'styled-components';
import ImageGallery from '../../components/uielements/ImageGallery';
import Moment from 'moment';
import { Spin } from 'antd';
import { siteConfig } from '../../config.js';

const MediasContainer = styled.div`
  padding: 10px 10px 0px 10px;
`;

const ReplyWrapper = styled.div`
  margin-bottom: 24px;

  .body {
    background: ${props =>
      props.isFromHost
        ? 'linear-gradient( 40deg, rgb(247,56,97) 25%, rgb(254,114,78) 100%)'
        : '#fff'};
    color: ${props => (props.isFromHost ? '#fff' : 'inherit')};
    border-radius: 4px;
    opacity: ${props => (props.isHidden ? 0.25 : 1)};
  }

  .info {
    position: relative;
    padding: 12px 8px 12px 24px;
    display: flex;

    .sender {
      font-size: 16px;
      font-weight: 600;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .send-time {
      margin-left: 0.5rem;
      margin-right: 1rem;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: inherit;
      text-decoration: underline;
    }
  }

  .hide-button {
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
  }
`;

const BodyContainer = styled.div`
  padding: ${props => (props.body ? '16px 24px' : '5px 24px')};
  font-size: 16px;
`;

const HostSignature = styled.span`
  color: rgb(247, 56, 97);
`;

const Reply = (props: {
  eventId: string,
  isPublicStream: boolean,
  reply: any,
  toggleHidden?: ({
    eventId: string,
    type: string,
    id: number,
    hidden: boolean,
  }) => void,
}) => {
  const { reply } = props;

  const toggleHidden = () => {
    if (props.toggleHidden) {
      props.toggleHidden({
        eventId: props.eventId,
        type: reply.type,
        id: reply.id,
        hidden: !reply.hidden,
      });
    }
  };

  const isFromHost = reply.type === 'message';
  const replyUrl =
    reply.type === 'message'
      ? siteConfig.shortUrl + `/${props.eventId}/m/${reply.id}`
      : siteConfig.shortUrl + `/${props.eventId}/r/${reply.id}`;

  return (
    <ReplyWrapper isFromHost={isFromHost} isHidden={reply.hidden}>
      <Spin spinning={!!reply.loading}>
        <div
          className="body"
          title={
            reply.hidden ? 'This message is hidden from the public stream' : ''
          }>
          <div>
            {reply.medias &&
              reply.medias.length > 0 && (
                <MediasContainer>
                  <ImageGallery
                    medias={reply.medias.map(m => ({
                      ...m,
                      replyUrl: `${replyUrl}/${m.id}`,
                    }))}
                    isPublicStream={props.isPublicStream}
                  />
                </MediasContainer>
              )}

            <BodyContainer body={reply.body}>
              <div>{reply.body}</div>
            </BodyContainer>
          </div>
        </div>
      </Spin>
      <div className="info">
        <span className="sender">
          &mdash;&nbsp; {reply.sender}{' '}
          {isFromHost && <HostSignature>(host)</HostSignature>}
        </span>
        <a
          className="send-time"
          href={replyUrl}
          target={props.isPublicStream ? '_self' : '_blank'}>
          {Moment(reply.received_at).format('h:mm A')}
        </a>
        {!props.isPublicStream && (
          <span
            className="hide-button"
            title={
              reply.hidden
                ? 'Make message visible to the public stream'
                : 'Hide message from public stream'
            }
            onClick={toggleHidden}>
            {reply.hidden ? 'Make visible' : 'Hide'}
          </span>
        )}
      </div>
    </ReplyWrapper>
  );
};

export default Reply;
