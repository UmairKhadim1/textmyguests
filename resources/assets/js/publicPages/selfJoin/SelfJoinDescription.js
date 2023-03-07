import React from 'react';
import styled from 'styled-components';
import Moment from 'moment';

const DescriptionContainer = styled.div`
  text-align: center;
  .title {
    font-size: 2.5rem;
    line-height: 1.15;
    margin-bottom: 0.35rem;
  }

  .date {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    font-size: 1.75rem;
    color: ${({ theme }) => theme.palette.color[2]}; /* pink */
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 1.1rem;
    .bold {
      font-weight: bold;
    }
  }

  @media only screen and (min-width: 576px) {
    .title {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .date {
      font-size: 1.15rem;
      margin-bottom: 1.25rem;
    }

    .subtitle {
      font-size: 2rem;
      color: ${({ theme }) => theme.palette.color[2]}; /* pink */
      margin-bottom: 0.25rem;
    }
  }
`;

type Props = {
  event: any,
};

const SelfJoinDescription: React.FC = (props: Props) => {
  const { event } = props;
  return (
    <DescriptionContainer>
      <h1 className="title">{event.name}</h1>
      {event.eventDate && (
        <div className="date">
          {Moment(event.eventDate).format('dddd, MMMM Do, YYYY')}
        </div>
      )}
      <h3 className="subtitle">Join this event!</h3>

      <p>
        To receive text messages from the hosts of{' '}
        <span className="bold">{event.name}</span>, please provide your name and
        phone number.
      </p>
    </DescriptionContainer>
  );
};

export default SelfJoinDescription;
