/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import styled from 'styled-components';

const PhoneNumberInfoContainer = styled.div`
  display: flex;
  line-height: 1.5;
  padding: 1rem;
  background-color: #ffffff;
  margin-top: 0.5rem;

  .icon {
    color: ${({ theme }) => theme.palette.primary[0]};
  }
`;

const PhoneNumberInfo = () => (
  <PhoneNumberInfoContainer>
    <div style={{ marginRight: '0.5rem' }}>
      <i className="ion-information-circled icon" />
    </div>
    <div>
      <div>
        Messages you send to your guests will come from one of these phone
        numbers. Messages sent to these numbers from guests of your event will
        appear in your Reply Stream. These numbers are dedicated to messaging
        for your event and are not used for any other purpose.
      </div>
    </div>
  </PhoneNumberInfoContainer>
);

export default PhoneNumberInfo;
