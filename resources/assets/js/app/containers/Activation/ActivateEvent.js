// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { History } from 'react-router-dom';
import { Layout } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import store from '../../redux/store';
import PlanDescription from './PlanDescription';
import Pay from './Pay';
import { useLocation } from 'react-router-dom';
import ReactPixel from '../../components/pixel/FacebookPixel';
import ReactGA from '../../components/pixel/ReactGA';
import ReactPinterestTag from '../../components/pixel/PinterestPixel';
const { Content } = Layout;
ReactGA.plugin.require('ecommerce');

const FlexContainer = styled.div`
  @media only screen and (min-width: 992px) {
    display: flex;
    align-items: flex-start;
  }
`;

const ActivateEvent = (props: {
  event: Object,
  processingPayment: boolean,
  activateEvent: ({
    eventId: string,
    tokenId: string,
    price: number,
  }) => void,
  loadUser: () => void,
  loadingUser: boolean,
  user: any,
  history: History,
}) => {
  const location = useLocation();
  const activatePromotion =
    location && location.state && location.state.activatePromotion;

  const { event, activateEvent } = props;
  const [eventDate, setEventDate] = useState(event.eventDate);
  const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
  const [promotion, setPromotion] = useState(
    activatePromotion ? 'share50' : ''
  );
  const [totalPrice, setTotalPrice] = useState(149.0);
  const [promoId, setPromoId] = useState(0);
  const guestLimit = 500;
  const isOverLimit = event.payment.spentCredits > guestLimit;

  const handleActivateEvent = (token: { id: string }, price: number) => {
    if (event && event.id && eventDate) {
      activateEvent({
        eventId: event.id,
        tokenId: token.id,
        price,
        promotion,
        eventDate,
        totalPrice,
        promoId,

        cb: () => {
          //Pinterest Pixel
          ReactPinterestTag.track('checkout', {
            order_id: event.id,
            value: price,
            currency: 'USD',
            time: new Date().toISOString(),
          });

          //FaceBook Pixel
          ReactPixel.track('Purchase', {
            value: price,
            currency: 'USD',
            date: new Date().toISOString(),
          }); //purchasing log on facebook

          //Google Analytics
          ReactGA.plugin.execute('ecommerce', 'addItem', {
            id: event.id.toString(),
            name: 'Shindigs',
            price: price.toString(),
            category: 'Activation',
            quantity: '1',
          });
          ReactGA.plugin.execute('ecommerce', 'addTransaction', {
            id: event.id.toString(),
            revenue: price.toString(),
          });
          ReactGA.plugin.execute('ecommerce', 'send');
          ReactGA.plugin.execute('ecommerce', 'clear');

          // props.history.push('/dashboard/invoices');
          props.history.push('/dashboard/event-activated', 'event-activated');
        },
      });
    }
  };

  const handleDateChange = date => {
    setEventDate(date);
    setShowDateErrorMessage(false);
  };

  // We load the user info to get his/her email address
  const { loadUser } = props;
  useEffect(
    () => {
      loadUser();
    },
    [loadUser]
  );

  return (
    <LayoutWrapper>
      <PageHeader>
        <span className="title">Activate Event</span>
      </PageHeader>
      <Content style={{ maxWidth: '100%' }}>
        {isOverLimit && (
          <ContactUsAlert>
            <i className="ion-alert-circled icon" />
            <div>
              Please contact us at{' '}
              <a href="mailto:help@textmyguests.com">help@textmyguests.com</a>{' '}
              for events over {guestLimit} guests.
            </div>
          </ContactUsAlert>
        )}
        <FlexContainer>
          <PlanDescription
            eventDate={eventDate}
            promotion={promotion}
            setPromotion={setPromotion}
            handleDateChange={handleDateChange}
            showDateErrorMessage={showDateErrorMessage}
            isProfessional={props.user.isProfessional}
          />

          <Pay
            event={event}
            eventDate={eventDate}
            onBuy={handleActivateEvent}
            guestLimit={guestLimit}
            processingPayment={props.processingPayment}
            loadingUser={props.loadingUser}
            user={props.user}
            promotion={promotion}
            setTotalPrice={setTotalPrice}
            setPromoId={setPromoId}
            setShowDateErrorMessage={setShowDateErrorMessage}
            showDateErrorMessage={showDateErrorMessage}
          />
        </FlexContainer>
      </Content>
    </LayoutWrapper>
  );
};

const ContactUsAlert = styled.div`
  padding: 0.75rem 1.25rem 0.75rem;
  margin-bottom: 1rem;
  background: #fff;
  border: 2px solid ${({ theme }) => theme.palette.warning[0]};
  display: flex;
  align-items: center;
  font-size: 16px;

  .icon {
    margin-right: 1rem;
    font-size: 1.5rem;
  }
`;

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    user: store.select.Auth.user(state),
    processingPayment: state.loading.effects.Event.activateEvent,
    loadingUser: state.loading.effects.Auth.me,
  }),
  ({ Event: { activateEvent }, Auth: { me } }) => ({
    activateEvent,
    loadUser: me,
  })
)(ActivateEvent);
