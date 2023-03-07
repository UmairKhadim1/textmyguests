import React from 'react';
import Event from '../../type';
import moment from 'moment';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

type Props = {
  event: Event,
};

const DashboardHeaderWrapper = styled.div`
  padding-top: 18px;
  text-align: center;
  font-size: 16px;
`;

const DaysLeftContainer = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
`;

const EventNameWrapper = styled.div`
  display: inline-block;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0px 35px;

  h1 {
    font-size: 32px;
  }

  .edit-icon {
    position: absolute;
    top: 25%;
    right: -28px;
    color: inherit;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
`;

const DashboardHeader = (props: Props) => {
  const { event } = props;
  let daysLeft = 0;
  let formattedDate = event ? event.eventDate : '';
  if (event && event.eventDate && 'diff' in event.eventDate) {
    const now = moment();
    const msLeft = props.event.eventDate.diff(now);
    daysLeft = Math.ceil(moment.duration(msLeft).as('days'));

    formattedDate = event.eventDate.format('dddd, MMMM Do, YYYY');
  }

  return (
    <DashboardHeaderWrapper>
      {/* Event name */}
      <EventNameWrapper>
        <h1>{event.name}</h1>
        <Link className="edit-icon" to="/dashboard/event-settings">
          <i className="ion-edit" title="Edit your event" />
        </Link>
      </EventNameWrapper>

      {/* Location (City, State) */}
      {event.location &&
        event.location.city &&
        event.location.state && (
          <div>
            {event.location.city}, {event.location.state}
          </div>
        )}

      {/* Event formatted date */}
      {event.eventDate && <div>{formattedDate}</div>}

      {/* Days left message + activate button */}
      {event.eventDate &&
        daysLeft >= 0 && (
          <DaysLeftContainer>
            {daysLeft === 0 ? (
              "It's today!"
            ) : (
              <span>
                {daysLeft} day
                {daysLeft > 1 && 's'} to go!
              </span>
            )}
          </DaysLeftContainer>
        )}
    </DashboardHeaderWrapper>
  );
};

export default DashboardHeader;
