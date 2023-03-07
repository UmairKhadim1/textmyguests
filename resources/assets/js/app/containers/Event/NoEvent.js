// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import Spin from '../../components/feedback/spin';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  .welcome {
    font-size: 48px;
    font-weight: 300;
    text-align: center;
  }

  .message {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const EmptyView = ({ loadingEvents }: { loadingEvents: boolean }) => (
  <LayoutWrapper>
    {loadingEvents ? (
      <Wrapper>
        <Spin tip="Loading your events" />
      </Wrapper>
    ) : (
      <Wrapper>
        <h1 className="welcome">Welcome to TextMyGuests</h1>
        <p className="message">
          You do not have any events yet. Add one using the button below.
        </p>
        <Link
          className="ant-btn ant-btn-primary ant-btn-lg"
          to="/dashboard/new-event">
          Create Event
        </Link>
      </Wrapper>
    )}
  </LayoutWrapper>
);

export default connect(state => ({
  loadingEvents:
    state.loading.effects.Event.loadEvents ||
    state.loading.effects.Auth.processInvitation,
}))(EmptyView);
