import React from 'react';
import styled from 'styled-components';
import { CardWrapper } from './DashboardCard';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const ActivateEventCard = styled(CardWrapper)`
  justify-content: ${({ activated }) =>
    activated ? 'space-around' : 'center'};
  background-color: ${({ activated }) => (activated ? '#fff' : '#fffbe6')};
  text-align: center;
  padding: 30px 20px;
  min-height: 200px;

  .title {
    font-size: 1.75rem;
    font-weight: 400;
    text-align: center;
    line-height: 1.25;
    margin-bottom: ${({ activated }) => (activated ? '0' : '1.5rem')};
  }

  .icon {
    font-size: 2.5rem;
    text-align: center;
    color: ${({ theme }) => theme.palette.primary[0]};
    line-height: 1;
  }

  &:hover {
    box-shadow: -1px 2px 7px 0px rgba(0, 0, 0, 0.1);
  }

  .activated-icon {
    color: ${({ theme }) => theme.palette.success[0]};
    font-size: 50px;
  }

  .activated-feedback {
    font-size: 18px;
  }

  .not-activated-icon {
    color: #faad14;
    font-size: 20px;
  }

  .activate-button {
    button {
      white-space: normal;
      height: auto;
      padding: 5px 15px;
      font-size: 16px;
    }
  }
`;

type Props = {
  activated: boolean,
};

const DashboardCardActivate: React.FC = (props: Props) => (
  <ActivateEventCard activated={props.activated}>
    <h1 className="title">
      {props.activated ? 'Event Activated' : 'Event Inactive'}
    </h1>

    {props.activated ? (
      <>
        <div className="activated-icon">
          <i className="ion-checkmark" />
        </div>
        <div className="activated-feedback">Ready to Send</div>
      </>
    ) : (
      <>
        <div className="activate-button">
          <Link to="/dashboard/activate">
            <Button type="primary">Activate Now to Enable Sending</Button>
          </Link>
        </div>
      </>
    )}
  </ActivateEventCard>
);

export default DashboardCardActivate;
