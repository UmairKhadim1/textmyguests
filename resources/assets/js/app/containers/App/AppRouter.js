// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Spin } from 'antd';

import store from '../../redux/store';

import { ActivationAlert } from '../../components/feedback/ActivationAlert';
import { DisabledAlert } from '../../components/feedback/DisabledAlert';

import NewEvent from '../Event/newEvent';
import EventSettings from '../Event/eventSettings';

import ActivateEvent from '../Activation/ActivateEvent';
import Invoices from '../Payment/Invoices';
import Payments from '../Payment/Payments';

import Dashboard from '../Dashboard/Dashboard';
import MessageList from '../Message/messageList';
import EditMessage from '../Message/editMessage';

import ReplyStream from '../ReplyStream/ReplyStream';
import GuestList from '../Guest/guestsList';

import BulkUpload from '../Guest/BulkUpload';
import EditGuest from '../Guest/editGuest';
import GroupList from '../Group/groupList';
import Promotion from '../Pages/Promotion';

import EditGroup from '../Group/editGroup';
import UserSettings from '../User/UserSettings';
import ContactUs from '../Contact/ContactUs';
import Individual from '../IndividualText/Individual';

import type { Event } from '../../redux/types';
import ThankYou from '../Activation/ThankYou';
import NotificationList from '../Notification/NotificationList';
import Partnership from '../Pages/Partnership';

type Props = {
  url: string,
  events: Array<Event>,
};

const LoadingEvents = () => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem 0',
    }}>
    <Spin tip="Loading your events" />
  </div>
);

const MainPages = connect(state => ({
  event: store.select.Event.currentEvent(state),
  events: store.select.Event.allEvents(state),
  eventsAreLoaded: state.Event.eventsAreLoaded,
  processingInvitation: state.loading.effects.Auth.processInvitation,
  loadingEvents:
    state.loading.effects.Event.loadEvents ||
    state.loading.effects.Auth.processInvitation,
}))(
  ({
    event,
    events,
    eventsAreLoaded,
    url,
    processingInvitation,
    loadingEvents,
  }: {
    url: string,
    event?: Object,
    events: Array<Object>,
    processingInvitation: boolean,
    loadingEvents: boolean,
  }) => {
    const NoEventRedirect = () => <Redirect to={`${url}/new-event`} />;
    const displayComponent = component =>
      events.length && !processingInvitation
        ? component
        : loadingEvents || !eventsAreLoaded
          ? LoadingEvents
          : NoEventRedirect;
    return (
      <>
        {event && event.payment && !event.payment.activated ? (
          <ActivationAlert banner />
        ) : event && event.phoneNumbers.length === 0 ? (
          <DisabledAlert banner />
        ) : null}
        <Switch>
          <Route
            exact
            path={`${url}`}
            component={displayComponent(Dashboard)}
          />
          <Route
            exact
            path={`${url}/messages`}
            component={displayComponent(MessageList)}
          />
          <Route
            path={`${url}/messages/edit/:id?`}
            component={displayComponent(EditMessage)}
          />
          <Route
            path={`${url}/replies`}
            component={displayComponent(ReplyStream)}
          />
          <Route
            exact
            path={`${url}/guests`}
            component={displayComponent(GuestList)}
          />
          <Route
            exact
            path={`${url}/guests/bulk-upload`}
            component={displayComponent(BulkUpload)}
          />
          <Route
            path={`${url}/guests/edit/:id?`}
            component={displayComponent(EditGuest)}
          />
          <Route
            exact
            path={`${url}/groups`}
            component={displayComponent(GroupList)}
          />
          <Route
            path={`${url}/groups/edit/:id?`}
            component={displayComponent(EditGroup)}
          />
             <Route
            path={`${url}/direct`}
            component={displayComponent(Individual)}
          />
             {/* <Route
            path={`${url}/individual/edit/:id?`}
            component={displayComponent(EditGroup)}
          /> */}

          <Route
            exact
            path={`${url}/event-settings`}
            component={displayComponent(EventSettings)}
          />
          <Route
            exact
            path={`${url}/event-activated`}
            component={displayComponent(ThankYou)}
          />
          {/* <Route
            exact
            path={`${url}/partnership`}
            component={displayComponent(Partnership)}
          /> */}
        </Switch>
      </>
    );
  }
);

const AppRouter = (props: Props) => {
  const { url, events, eventsAreLoaded, processingInvitation } = props;
  const NoEventRedirect = () => <Redirect to={`${url}/new-event`} />;
  const displayComponent = component =>
    events.length && !processingInvitation
      ? component
      : props.loadingEvents || !eventsAreLoaded
        ? LoadingEvents
        : NoEventRedirect;
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route
          exact
          path={`${url}/notification`}
          component={NotificationList}
        />
        <Route exact path={`${url}/user-settings`} component={UserSettings} />
        <Route exact path={`${url}/new-event`} component={NewEvent} />
        <Route
          exact
          path={`${url}/activate`}
          component={displayComponent(ActivateEvent)}
        />
        <Route
          exact
          path={`${url}/invoices`}
          component={displayComponent(Invoices)}
        />
        <Route
          exact
          path={`${url}/payments`}
          component={displayComponent(Payments)}
        />
        <Route exact path={`${url}/promotion`} component={Promotion} />
        <Route exact path={`${url}/contact`} component={ContactUs} />
        <Route path={url} render={() => <MainPages url={url} />} />
        <Route path="" component={NewEvent} />
      </Switch>
    </>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    [pathname]
  );

  return null;
};

export default withRouter(
  connect(state => ({
    events: store.select.Event.allEvents(state),
    processingInvitation: state.loading.effects.Auth.processInvitation,
    eventsAreLoaded: state.Event.eventsAreLoaded,
    loadingEvents:
      state.loading.effects.Event.loadEvents ||
      state.loading.effects.Auth.processInvitation,
  }))(AppRouter)
);
