import React from 'react';
import { Link } from 'react-router-dom';
import Alert from './alert';

export const GuestLimitAlert = ({ banner }: { banner: boolean }) => (
  <Alert
    type="error"
    banner={banner}
    showIcon
    message={
      <span>
        Your messages cannot be sent right now because you have exceeded 500
        guests. To enable your messages, please{' '}
        <Link to="/dashboard/contact" style={{ fontWeight: 600 }}>
          contact us
        </Link>{' '}
        .
      </span>
    }
    style={{ fontSize: '14px' }}
  />
);

export default GuestLimitAlert;
