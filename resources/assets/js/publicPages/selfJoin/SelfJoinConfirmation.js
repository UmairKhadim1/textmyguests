import React from 'react';
import styled from 'styled-components';
import Button from '../../app/components/uielements/button';

const ConfirmationContainer = styled.div`
  text-align: center;

  .confirmation {
    margin-top: 1rem;
  }

  .title {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.palette.color[2]}; /* pink */
  }

  .subtitle {
    font-size: 1.75rem;
  }

  p {
    font-size: 1.25rem;
  }

  .h-line {
    margin: 3rem 20%;
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
  }

  .learn-more {
    margin-top: 2rem;
    p {
      font-size: 1.15rem;
    }
  }

  button {
    border-radius: 4px;
  }
`;

type Props = {
  event: any,
};

const SelfJoinConfirmation = (props: Props) => (
  <ConfirmationContainer>
    <div className="confirmation">
      <h1 className="title">Success!</h1>
      <h1 className="subtitle">You have joined {props.event.name}</h1>
      <p>You will now receive text messages from the hosts.</p>
    </div>
    <div className="h-line" />
    <div className="learn-more">
      <p>Want to know more about TextMyGuests?</p>
      <a href="https://textmyguests.com">
        <Button type="primary">Visit TextMyGuests</Button>
      </a>
    </div>
  </ConfirmationContainer>
);

export default SelfJoinConfirmation;
