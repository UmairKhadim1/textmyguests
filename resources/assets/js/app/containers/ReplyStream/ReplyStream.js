import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { History } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';
import store from '../../redux/store';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { ComponentTitleWrapper } from '../../components/utility/pageHeader.style';
import Stream from './Stream';
import DemoStream from './DemoStream';
import MakeReplyStreamPublic from './MakeReplyStreamPublic';
import Spin from '../../components/feedback/spin';

const { Content } = Layout;

const Wrapper = styled.div``;

const Message = styled.div`
  padding: 35px;
  color: #555;
  font-size: 18px;
  text-align: center;
`;

const CenteredRow = styled(Row)`
  display: flex;
  justify-content: center;
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;

  @media only screen and (max-width: 480px) {
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
`;

const ReplyStreamPageHeader = styled(ComponentTitleWrapper)`
  @media only screen and (max-width: 480px) {
    margin: 0 10px;
    margin-bottom: 0px;
  }
`;

type Props = {
  event?: Object,
  repliesByDay?: Object,
  loadReplies: (eventId: string) => void,
  loadingReplyStream: boolean,
  savingPublicStream: boolean,
  toggleStreamPublic: ({
    eventId: string,
    isStreamPublic: boolean,
  }) => void,
  user: any,
  saveMessage: any => void,
  allGuestsGroup: any,
  savingMessage: boolean,
  history: History,
  loadUser: () => void,
  toggleHidden: ({
    eventId: string,
    type: string,
    id: number,
    hidden: boolean,
  }) => void,
  loadGroups: (eventId: string) => void,
};

const ReplyStream = (props: Props) => {
  const { event, loadReplies, loadUser, loadGroups, repliesByDay = {} } = props;
  useEffect(
    () => {
      if (event && event.id) {
        loadReplies(event.id);
        loadUser();

        if (!props.allGuestsGroup) {
          loadGroups(event.id);
        }
      }
    },
    [event]
  );

  // This is the view for inactivated events
  let view = (
    <Fragment>
      <CenteredRow>
        <Col md={18}>
          <Message>
            Once you have paid to activate your event, guests replies to your
            messages (including pictures) will appear here.
          </Message>
        </Col>
      </CenteredRow>
      <DemoStream />
    </Fragment>
  );

  if (event.payment && event.payment.activated) {
    // If there are messages/replies, render the stream
    view = props.loadingReplyStream ? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem 0rem',
        }}>
        <Spin tip="Loading Reply Stream..." />
      </div>
    ) : Object.keys(repliesByDay).length > 0 ? (
      <Stream
        eventId={event.id}
        repliesByDay={repliesByDay}
        toggleHidden={props.toggleHidden}
      />
    ) : (
      // If there is no message/reply, render a message
      // and the demo stream.
      <Fragment>
        <CenteredRow>
          <Col md={18}>
            <Message>
              Guests replies to your messages (including pictures) will appear
              here. Send your first message to activate the stream!
            </Message>
          </Col>
        </CenteredRow>
        <DemoStream />
      </Fragment>
    );
  }

  return (
    <Wrapper>
      <LayoutWrapper>
        <FlexWrapper>
          <ReplyStreamPageHeader>
            <span className="title">Reply Stream</span>
          </ReplyStreamPageHeader>
          <MakeReplyStreamPublic
            event={event}
            loading={props.savingPublicStream}
            toggleStreamPublic={props.toggleStreamPublic}
            user={props.user}
            saveMessage={props.saveMessage}
            allGuestsGroup={props.allGuestsGroup}
            savingMessage={props.savingMessage}
            history={props.history}
          />
        </FlexWrapper>
        <Content>{view}</Content>
      </LayoutWrapper>
    </Wrapper>
  );
};

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    repliesByDay: store.select.Reply.allRepliesByDay(state),
    savingPublicStream: state.loading.effects.Event.toggleStreamPublic,
    user: store.select.Auth.user(state),
    allGuestsGroup: store.select.Group.allGroups(state).find(g => g.is_all),
    savingMessage: state.loading.effects.Message.saveMessage,
    loadingReplyStream: state.loading.effects.Reply.loadReplies,
  }),
  ({
    Reply: { loadReplies, toggleHidden },
    Event: { toggleStreamPublic },
    Auth: { me },
    Message: { saveMessage },
    Group: { loadGroups },
  }) => ({
    loadReplies,
    toggleStreamPublic,
    loadUser: me,
    saveMessage,
    toggleHidden,
    loadGroups,
  })
)(ReplyStream);
