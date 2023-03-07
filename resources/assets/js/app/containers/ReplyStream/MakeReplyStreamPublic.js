import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Checkbox from '../../components/uielements/checkbox';
import Spin from '../../components/feedback/spin';
import HelpTooltip from '../../components/uielements/HelpTooltip';
import { siteConfig } from '../../config.js';
import { Modal } from 'antd';
import Reply from './Reply';
import Moment from 'moment';
import DownloadImages from './DownloadImages';

type Props = {
  event: string,
  loading: boolean,
  toggleStreamPublic: ({ eventId: string, isStreamPublic: boolean }) => void,
  user: any,
  saveMessage: any => void,
  allGuestsGroup: any,
  savingMessage: boolean,
  history: History,
};

const Wrapper = styled.div`
  white-space: nowrap;
  padding-top: 8px;

  .ant-checkbox-wrapper {
    font-size: 16px;
  }

  @media only screen and (max-width: 480px) {
    margin-left: 10px;
  }
`;

const UrlContainer = styled.div`
  font-size: 13px;
`;

const StreamUrl = styled.a`
  color: #f73861;
  font-weight: 600;
`;

const MakeReplyStreamPublic = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  const { event, loading } = props;
  const onChange = e => {
    props.toggleStreamPublic({
      eventId: props.event.id,
      isStreamPublic: e.target.checked,
    });
  };

  const addMessageToShareURL = () => {
    const sendAt = event.eventDate
      ? event.eventDate.hour(8).isAfter(Moment())
        ? event.eventDate.hour(8)
        : Moment().add(1, 'hour')
      : Moment()
          .add(1, 'month')
          .hour(8);

    const newMessage = {
      content: `Check it out! We are collecting pictures and replies from our event's guests in our Reply Stream here: tmg.link/${
        event.id
      }`,
      date: sendAt.format('MM-DD-YYYY'),
      time: sendAt.format('h:mm a'),
      immediately: false,
      ready: false,
      recipients: [{ id: props.allGuestsGroup.id }],
    };

    props.saveMessage({
      eventId: event.id,
      message: newMessage,
      cb: () => {
        props.history.push('/dashboard/messages');
      },
    });
  };

  // If stream becomes public, pop a modal to ask if user
  // wants to add a message to share the reply stream URL
  const wasLoadingRef = useRef();
  useEffect(() => {
    wasLoadingRef.current = props.loading;
  });
  const wasLoading = wasLoadingRef.current;
  if (wasLoading && !props.loading && !showModal && event.isStreamPublic) {
    setShowModal(true);
  }

  const isChecked = loading ? !event.isStreamPublic : event.isStreamPublic;

  const shortUrl = siteConfig.shortUrl + '/' + event.id;

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <Checkbox checked={isChecked} onChange={onChange}>
          Make reply stream public
          {!event.isStreamPublic && (
            <HelpTooltip
              placement="topLeft"
              title="Allow your guests to see the reply stream"
            />
          )}
        </Checkbox>
        {!!event.isStreamPublic && (
          <UrlContainer>
            URL:{' '}
            <StreamUrl href={shortUrl} target="_blank">
              tmg.link/
              {event.id}
            </StreamUrl>
            <HelpTooltip
              placement="left"
              title="Share this URL with your guests so they can see the stream!"
            />
          </UrlContainer>
        )}
      </Wrapper>
      <Modal
        title="Your guests can now access the reply stream!"
        visible={showModal}
        onOk={() => addMessageToShareURL()}
        onCancel={() => setShowModal(false)}
        confirmLoading={props.savingMessage}
        okText="Yes, add message"
        cancelText="No">
        <div style={{ fontSize: '15px' }}>
          <p style={{ marginBottom: '2rem' }}>
            Would you like to add a message to share the Reply Stream URL with
            your guests?
          </p>

          <div style={{ opacity: 0.85, margin: '0rem 2rem' }}>
            <Reply
              reply={{
                body: `Check it out! We are collecting pictures and replies from our event's guests in our Reply Stream here: tmg.link/${
                  event.id
                }`,
                sender: props.user
                  ? props.user.first_name + ' ' + props.user.last_name
                  : '',
                type: 'message',
                time: '',
              }}
              isPublicStream={true}
            />
          </div>

          {!event.eventDate || event.eventDate.hour(8).isAfter(Moment()) ? (
            <p>
              The message will be disabled and set to send at 8:00am the day of
              your event. You will be able to edit the sending date, time and
              content.
            </p>
          ) : (
            <p>
              The message will be disabled and set to send in one hour. You will
              be able to edit the sending date, time and content.
            </p>
          )}
        </div>
      </Modal>
      <DownloadImages event={event} />
    </Spin>
  );
};

export default MakeReplyStreamPublic;
