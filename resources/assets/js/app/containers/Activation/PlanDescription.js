import React from 'react';
import styled from 'styled-components';
import { DatePicker, Checkbox } from 'antd';
import Moment from 'moment';
import type TMoment from 'moment';
import { Link } from 'react-router-dom';

const PlanContainer = styled.div`
  background: ${props => (props.disabled ? '#e6e6e6' : '#ffffff')};
  padding: 1rem 1.5rem;
  margin: 0rem 0rem 1rem 0rem;
  flex-grow: 1;

  @media only screen and (min-width: 992px) {
    margin: 0rem 1rem 0rem 0rem;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;

  .image img {
    width: 44px;
    opacity: 0.175;
  }

  .description {
    flex-grow: 1;
    margin-left: 1.5rem;
    margin-right: 1rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.color[2]}; /* pink */
    font-weight: 600;
    font-size: 16px;
  }

  .price {
    font-weight: 600;
    font-size: 17px;
  }

  @media only screen and (min-width: 576px) {
    .price {
      font-size: 20px;
    }
  }
`;

const DescriptionContainer = styled.div`
  padding-top: 1rem;
  font-size: 15px;
  ul {
    padding-left: 1rem;
    list-style-type: none;

    li {
      padding: 0.35rem 0rem;

      .bold {
        font-weight: 600;
      }
    }
  }
`;

const EventDate = styled.div`
  font-size: 15px;
  font-weight: 600;

  .date-picker {
    text-align: center;
    margin-top: 0.65rem;
  }

  .checkbox {
    margin-top: 0.75rem;
    label {
      font-size: 15px;
    }
  }
`;

const DateLabel = styled.label`
  margin-right: 0.75rem;
  color: ${({ error, theme }) => (error ? theme.palette.error[1] : 'inherit')};
  font-weight: ${({ error }) => (error ? 700 : 400)};
`;

const Promotion = styled.div`
  margin-top: 0.75rem;
  margin-bottom: 1rem;
  padding: 1.25rem 1.5rem;
  background: ${({ theme }) => theme.palette.grayscale[8]};
  .title {
    font-size: 18px;
    color: ${({ theme }) => theme.palette.color[2]}; /* pink */
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  label {
    font-size: 15px;

    .highlight {
      font-weight: 900;
    }
  }

  .more-info {
    margin-left: 0.5rem;
    font-size: 0.95em;

    .icon {
      margin-left: 0.25rem;
      vertical-align: middle;
    }

    :hover {
      text-decoration: underline;
    }
  }
`;

const ListItem: React.FC = (props: { children: React.ReactElement }) => (
  <li>
    <i className="ion-checkmark" style={{ marginRight: '1.25rem' }} />
    {props.children}
  </li>
);

type Props = {
  isProfessional: Boolean | false,
  eventDate: TMoment,
  promotion: string | null,
  setPromotion: (value: string | null) => void,
  handleDateChange(value: TMoment): void,
  showDateErrorMessage: boolean,
};

const PlanDescription: React.FC = (props: Props) => (
  <PlanContainer>
    <FlexContainer>
      <div className="image">
        <img src="/images/users-group-3.svg" alt="plan-image" />
      </div>
      <div className="description">Unlimited package</div>
      <div className="price">$149/event</div>
    </FlexContainer>
    <DescriptionContainer>
      <ul>
        <ListItem>Unlimited guests</ListItem>
        <ListItem>Unlimited groups</ListItem>
        <ListItem>Unlimited messages</ListItem>
        <ListItem>Unlimited replies and photos</ListItem>
        <ListItem>Shareable URL with stream of replies and photos</ListItem>
        <ListItem>
          Dedicated phone number active for 30 days after the event
        </ListItem>
        <ListItem>Single, one-time payment - no subscriptions</ListItem>
      </ul>
    </DescriptionContainer>
    {!props.isProfessional ? (
      <Promotion>
        <h4 className="title">Get $50 off!</h4>
        <Checkbox
          checked={props.promotion ? true : false}
          onChange={e =>
            props.setPromotion(e.target.checked ? 'share50' : null)
          }>
          Yes, I want to get a <span className="highlight">$50 discount</span>{' '}
          by sending a single promotional message to my guests at the conclusion
          of my event.
          <Link to="/dashboard/promotion" className="more-info">
            Get more info
            <i className="ion-ios-arrow-forward icon" />
          </Link>
        </Checkbox>
      </Promotion>
    ) : (
      ''
    )}
    <EventDate>
      Your event date will lock once you activate. If your event date has
      changed, please adjust it now.
      <div className="date-picker">
        <DateLabel error={props.showDateErrorMessage}>Event Date:</DateLabel>
        <DatePicker
          value={props.eventDate}
          onChange={props.handleDateChange}
          format="YYYY-MM-DD"
          disabledDate={current => current.isBefore(Moment(), 'day')}
        />
      </div>
    </EventDate>
  </PlanContainer>
);

export default PlanDescription;
