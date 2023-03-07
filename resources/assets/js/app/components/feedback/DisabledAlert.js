// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Alert from './alert';

const CustomAlert = styled(Alert)`
  && {
    width: 100%
    font-size: 16px;
  }
`;

const ReactivateLink = () => (
  <Link to="/dashboard/activate">Reactivate this event</Link>
);

const CreateNewLink = () => (
  <Link to="/dashboard/new-event">create a new event</Link>
);

export const DisabledAlert = ({ banner }: { banner: boolean }) => (
  <CustomAlert
    type="warning"
    banner={banner}
    message={
      <span>
        The activation period for this event has ended. <ReactivateLink /> or{' '}
        <CreateNewLink /> to begin sending messages!
      </span>
    }
  />
);

export default DisabledAlert;
