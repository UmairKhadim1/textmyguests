import React from 'react';
import { Row, Col } from 'antd';
import DashboardCard from './DashboardCard';
import styled from 'styled-components';
import DashboardCardMessage from './DashboardCardMessage';
import DashboardCardActivate from './DashboardCardActivate';

const CardGroup = styled.div`
  margin-bottom: 14px;
  height: 100%;
  > div {
    margin-bottom: 14px;
  }

  @media only screen and (min-width: 768px) and (max-width: 1199px) {
    .card-element {
      height: calc(50% - 7px);
    }
  }

  @media only screen and (min-width: 1200px) {
    display: flex;
    .card-element {
      margin-right: 14px;
      width: calc(50% - 7px);
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
`;

type Props = {
  messages: any[],
  guestCount: number,
  groupCount: number,
  loadingMessages: boolean,
  loadingGuests: boolean,
  loadingGroups: boolean,
  eventIsActivated: boolean,
};

const DashboardStatistics: React.FC = (props: Props) => (
  <Row gutter={14} type="flex" justify="center" style={{ padding: '35px 0px' }}>
    <Col xs={24} md={12} lg={10}>
      <CardGroup>
        <div className="card-element">
          <DashboardCardMessage
            enabled={
              props.messages.filter(message => message.ready_to_send).length
            }
            total={props.messages.length}
            loading={props.loadingMessages}
          />
        </div>
        <div className="card-element">
          <DashboardCard
            label="Guests"
            count={props.guestCount}
            callToAction="Add guests"
            callToActionLink="/dashboard/guests"
            loading={props.loadingGuests}
          />
        </div>
      </CardGroup>
    </Col>
    <Col xs={24} md={12} lg={10}>
      <CardGroup>
        <div className="card-element">
          <DashboardCard
            label="Groups"
            count={props.groupCount}
            callToAction="Create groups"
            callToActionLink="/dashboard/groups"
            loading={props.loadingGroups}
          />
        </div>
        <div className="card-element">
          <DashboardCardActivate activated={props.eventIsActivated} />
        </div>
      </CardGroup>
    </Col>
  </Row>
);

export default DashboardStatistics;
