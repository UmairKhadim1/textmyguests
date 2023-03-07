import React, { useEffect } from 'react';
import { Button, Icon, Layout, Table, Tag, Row, Col } from 'antd';
import Switch from '../../components/uielements/switch';
import { connect } from 'react-redux';
import Moment from 'moment';
import store from '../../redux/store';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import MessageListWrapper from './messageList.style';
import Actions from '../../components/dataTable/actions';
import PromotionActions from '../../components/dataTable/promotionActions';
import HelpTooltip from '../../components/uielements/HelpTooltip';
import _ from 'lodash';
import GuestLimitAlert from '../../components/feedback/GuestLimitAlert';
import PromotionMessage from './PromotionMessage';
import { isEventActivated } from '../../helpers/functions';
import MessageChannel12 from './MessageChannel12';
import PushNotification from './pushNotification';

const { Column } = Table;
const { Content } = Layout;

type Props = {
  event: Object,
  messages: Array<Object>,
  loadMessages: string => void,
  toggleMessageStatus: any => void,
  deleteMessage: (string, string) => void,
  loading: boolean,
  deleting: boolean,
  history: Object,
  match: {
    url: string,
  },
};

const MessageList = (props: Props) => {
  const { event } = props;

  useEffect(
    () => {
      const { loadMessages } = props;
      if (event && event.id) loadMessages(event.id);
    },
    [(event ? event : {}).id]
  );

  const goToAddMessage = () => props.history.push(`${props.match.url}/edit/`);

  // Handling promotion messages
  const promotions = [];
  props.messages.forEach(message => {
    if (message.promotion) {
      promotions.push(message.promotion);
    }
  });

  const renderStatus = message => {
    if (message.sent != null) {
      return (
        <Tag color="green" style={{ marginRight: 0 }}>
          <Icon type="check" style={{ marginRight: 6 }} />
          Sent
        </Tag>
      );
    }

    const disabled =
      !isEventActivated(event) || message.promotion === 'share50';

    return (
      <Switch
        disabled={disabled}
        checked={
          message.loading ? !message.ready_to_send : message.ready_to_send
        }
        loading={message.loading || false}
        onChange={checked =>
          props.toggleMessageStatus({
            message: { ...message, ready: checked },
            eventId: event.id,
          })
        }
      />
    );
  };

  const orderedMessages = _.orderBy(
    props.messages,
    m => m.send_at.format('x'),
    ['asc']
  );

  // Check if guest limit is exceeded
  const guestLimitExceeded =
    event &&
    event.payment &&
    event.payment.activated &&
    event.payment.remainingCredits < 0;

  // Check if we should show promotion message
  let showPromotionMessage =
    (!props.loading || (props.messages && props.messages.length > 0)) &&
    !promotions.includes('share50');

  return (
    <MessageListWrapper>
      <LayoutWrapper>
        <PageHeader>
          <span className="title">Messages</span>
          {/* <MessageChannel12 />
          <PushNotification /> */}
          <Button icon="plus" type="primary" onClick={goToAddMessage}>
            New message
          </Button>
        </PageHeader>
        <Content style={{ overflow: 'auto' }}>
          {guestLimitExceeded && (
            <div style={{ marginBottom: '16px' }}>
              <GuestLimitAlert />
            </div>
          )}
          <Table
            loading={{
              spinning: props.loading || props.deleting,
              tip: props.deleting ? 'Deleting message' : 'Loading',
            }}
            rowKey={message => message.id}
            dataSource={orderedMessages}
            scroll={{ x: 'auto' }}>
            <Column
              title={
                <span className="column-title">
                  Send Day
                  <HelpTooltip title="The day the message will be sent if enabled" />
                </span>
              }
              key="sendDate"
              render={message => (
                <span>{Moment(message.send_at).format('MM/DD/YYYY')}</span>
              )}
            />
            <Column
              title={
                <span className="column-title">
                  Send Time
                  <HelpTooltip title="The time the message will be sent if enabled" />
                </span>
              }
              key="sendTime"
              render={message => (
                <span>{Moment(message.send_at).format('hh:mm A')}</span>
              )}
            />
            <Column
              title={
                <span className="column-title">
                  Status
                  <HelpTooltip title="The enabled status of the message. If it's off, it is a draft and will not be sent. You can turn it on and will be sent the date set or immediately if the date is passed. A check icon is displayed if it is already sent" />
                </span>
              }
              key="status"
              render={renderStatus}
            />
            <Column
              title={
                <span className="column-title">
                  Content
                  <HelpTooltip title="The text that is or will be sent" />
                </span>
              }
              key="content"
              className="content-column"
              render={message => (
                <span>
                  {message.image_thumbnail && (
                    <>
                      <img
                        src={message.image_thumbnail}
                        style={{
                          maxWidth: '80px',
                          maxHeight: '80px',
                          marginBottom: message.content ? '10px' : '0px',
                        }}
                      />
                      {message.content && <br />}
                    </>
                  )}
                  {message.content && <span>{message.content}</span>}
                </span>
              )}
            />
            <Column
              title={
                <span className="column-title">
                  Recipients
                  <HelpTooltip title="All the groups that will receive the message." />
                </span>
              }
              key="recipient"
              render={message =>
                Object.values(message.recipients).map(recipient => (
                  <Tag key={recipient.id}>{recipient.name}</Tag>
                ))
              }
            />
            <Column
              title={
                <span className="column-title">
                  Actions
                  <HelpTooltip title="Delete a message or edit an unsent message" />
                </span>
              }
              key="actions"
              render={message =>
                message.promotion === 'share50' ? (
                  <PromotionActions eventId={event.id} />
                ) : message.sent === null ? (
                  <Actions
                    onEdit={() =>
                      props.history.push(
                        `${props.match.url}/edit/${message.id}`
                      )
                    }
                    onDelete={() =>
                      props.deleteMessage({
                        eventId: event.id,
                        messageId: message.id,
                      })
                    }
                    deleteConfirmMessage="Are you sure you want to delete this message?"
                  />
                ) : null
              }
              className="actions-column"
            />
          </Table>

          <Row type="flex" justify="center">
            <Col xs={24} md={22} lg={20} xl={20}>
              <div
                style={{
                  margin: '0px 0px 20px',
                  fontSize: '15px',
                }}>
                <a href="/real-events" target="_blank">
                  <i className="ion-star" style={{ marginRight: '10px' }} />
                  Looking for inspiration? Click here to see messages from real
                  TextMyGuests events!
                </a>
              </div>
            </Col>
          </Row>

          {showPromotionMessage && (
            <Row
              type="flex"
              justify="center"
              style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
              <Col xs={24} md={22} lg={20} xl={20}>
                <PromotionMessage />
              </Col>
            </Row>
          )}
        </Content>
      </LayoutWrapper>
    </MessageListWrapper>
  );
};

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    messages: store.select.Message.allMessages(state),
    loading:
      state.loading.effects.Message.loadMessages ||
      state.loading.effects.Message.optOutPromotion,
    deleting: state.loading.effects.Message.deleteMessage,
  }),
  ({ Message: { loadMessages, toggleMessageStatus, deleteMessage } }) => ({
    loadMessages,
    toggleMessageStatus,
    deleteMessage,
  })
)(MessageList);




// onLoadMessages(state, messages = []) {
//   return messages.reduce((map, message) => {
//     map[message.id.toString()] = message;
//     return map;
//   }, {});
// },
// onLoadMessage(state, message) {
//   const newState = { ...state };
//   newState[message.id] = message;
//   return newState;
// },
// onSaveMessage(state, message) {
//   return {
//     ...state,
//     [message.id.toString()]: {
//       ...message,
//       send_at: Moment(message.send_at),
//     },
//   };
// },
// onToggleStatus(state, { messageId, loading }) {
//   return {
//     ...state,
//     [messageId]: {
//       ...state[messageId],
//       loading,
//     },
//   };
// },