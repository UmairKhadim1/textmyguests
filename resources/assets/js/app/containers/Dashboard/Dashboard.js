import React from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { Col, Layout, Row } from 'antd';
import Event from '../../type';
import DashboardHeader from './DashboardHeader';
import styled from 'styled-components';
import DashboardTips from './DashboardTips';
import GuestLimitAlert from '../../components/feedback/GuestLimitAlert';
import PromotionMessage from '../Message/PromotionMessage';
import Onboarding from './Onboarding';
import DashboardStatistics from './DashboardStatistics';
import { isEventActivated } from '../../helpers/functions';

const { Content } = Layout;

const DashboardWrapper = styled(LayoutWrapper)`
  padding: 10px 20px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.15);
  margin-top: 20px;
`;

type Props = {
  event: Event,
  guestCount: number,
  groupCount: number,
  messages: any[],
  loadingGuests: boolean,
  loadingGroups: boolean,
  loadingMessages: boolean,
  loadGuests: () => void,
  loadGroups: () => void,
  loadMessages: () => void,
  hideOnboarding: (eventId: string) => void,
};

class Dashboard extends React.Component<Props> {
  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.event.id !== this.props.event.id) {
      this.loadData();
    }
  }

  loadData = () => {
    this.props.loadGuests(this.props.event.id);
    this.props.loadGroups(this.props.event.id);
    this.props.loadMessages(this.props.event.id);
  };

  render() {
    const { event, messages, loadingMessages } = this.props;

    // Check if guest limit is exceeded
    const guestLimitExceeded =
      event &&
      event.payment &&
      event.payment.activated &&
      event.payment.remainingCredits < 0;

    // Should we display the promotional message banner?
    const promotions = [];
    messages.forEach(message => {
      if (message.promotion) {
        promotions.push(message.promotion);
      }
    });
    const showPromotionMessage =
      event &&
      event.payment &&
      event.payment.activated &&
      (!loadingMessages || (messages && messages.length > 0)) &&
      !promotions.includes('share50');

    return (
      <DashboardWrapper>
        <Content>
          <Row type="flex" justify="center">
            <Col xs={24} md={24} lg={20} xl={20}>
              <DashboardHeader event={this.props.event} />
              <Divider />
            </Col>
          </Row>

          {guestLimitExceeded && (
            <Row type="flex" justify="center" style={{ paddingTop: '20px' }}>
              <Col xs={24} md={24} lg={24} xl={20}>
                <GuestLimitAlert />
              </Col>
            </Row>
          )}

          {showPromotionMessage && (
            <Row type="flex" justify="center" style={{ marginTop: '1.25rem' }}>
              <Col xs={24} md={24} lg={20} xl={20}>
                <PromotionMessage />
              </Col>
            </Row>
          )}

          {event &&
            !event.hideOnboarding && (
              <>
                <Onboarding
                  messageCount={
                    messages ? messages.filter(m => !m.promotion).length : 0
                  }
                  guestCount={this.props.guestCount}
                  groupCount={this.props.groupCount}
                  eventIsActivated={isEventActivated(event)}
                  hideOnboarding={() => this.props.hideOnboarding(event.id)}
                />

                <Row type="flex" justify="center">
                  <Col xs={24} md={24} lg={20} xl={20}>
                    <Divider style={{ marginTop: 0 }} />
                  </Col>
                </Row>
              </>
            )}

          <DashboardStatistics
            messages={messages}
            guestCount={this.props.guestCount}
            groupCount={this.props.groupCount}
            loadingMessages={loadingMessages}
            loadingGuests={this.props.loadingGuests}
            loadingGroups={this.props.loadingGroups}
            eventIsActivated={isEventActivated(event)}
          />

          <Row type="flex" justify="center">
            <Col xs={24} md={24} lg={20} xl={20}>
              <Divider style={{ marginTop: 0 }} />
            </Col>
          </Row>

          <Row
            type="flex"
            justify="center"
            style={{ padding: '35px 0px 15px' }}>
            <Col xs={24} lg={20}>
              <DashboardTips />
            </Col>
          </Row>
        </Content>
      </DashboardWrapper>
    );
  }
}

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    guestCount: store.select.Guest.allGuests(state).length,
    groupCount: store.select.Group.allGroups(state).length,
    messages: store.select.Message.allMessages(state),
    loadingGuests: state.loading.effects.Guest.loadGuests,
    loadingGroups: state.loading.effects.Group.loadGroups,
    loadingMessages: state.loading.effects.Message.loadMessages,
  }),
  ({ Guest, Group, Message, Event }) => ({
    loadGuests: Guest.loadGuests,
    loadGroups: Group.loadGroups,
    loadMessages: Message.loadMessages,
    hideOnboarding: Event.hideOnboarding,
  })
)(Dashboard);
