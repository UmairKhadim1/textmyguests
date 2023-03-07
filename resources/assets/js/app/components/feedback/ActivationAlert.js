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

const ActivateLink = () => (
  <Link to="/dashboard/activate">Activate this event</Link>
);

export const ActivationAlert = ({ banner }: { banner: boolean }) => (
  <CustomAlert
    type="warning"
    banner={banner}
    message={
      <span>
        This is an unpaid trial event. Messages can only be sent to your Test Group at this time. <ActivateLink /> to begin sending
        messages!
      </span>
    }
  />
);

const UpgradeLink = () => (
  <Link to="/app/dashboard/activate">Upgrade this event</Link>
);

export const UpgradeAlert = () => (
  <CustomAlert
    type="info"
    message={
      <span>
        Want more guests? <UpgradeLink /> to increase your guest limit!
      </span>
    }
  />
);

export default ActivationAlert;
