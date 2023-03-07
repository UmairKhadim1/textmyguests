import React from 'react';
import styled from 'styled-components';
import { CardWrapper, Title as CardTitle, CallToAction } from './DashboardCard';
import { Spin } from 'antd';

const MessageCount = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;

  .number,
  .slash {
    font-size: 56px;
    line-height: 1;
  }

  .enabled {
    text-align: right;
    position: relative;
    margin-bottom: 21px;
    .text {
      position: absolute;
      bottom: -21px;
      right: 0;
    }
  }

  .total {
    text-align: left;
    position: relative;
    margin-bottom: 21px;
    .text {
      position: absolute;
      bottom: -21px;
      left: 0;
    }
  }

  .slash {
    margin: 0rem 0.25rem 0rem 0.5rem;
  }
`;

type Props = {
  enabled: number,
  total: number,
  loading: boolean,
};

const DashboardCardMessage: React.FC = (props: Props) =>
  props.loading ? (
    <CardWrapper style={{ minheight: '200px', justifyContent: 'center' }}>
      <Spin />
    </CardWrapper>
  ) : (
    <CardWrapper>
      <CardTitle>Messages</CardTitle>
      <MessageCount>
        <div className="enabled">
          <div className="number">{props.enabled}</div>
          <div className="text">enabled</div>
        </div>

        <div className="slash">/</div>

        <div className="total">
          <div className="number">{props.total}</div>
          <div className="text">total</div>
        </div>
      </MessageCount>
      <CallToAction to="/dashboard/messages">
        Edit your messages
        <i className="ion-arrow-right-c" style={{ marginLeft: '5px' }} />
      </CallToAction>
    </CardWrapper>
  );

export default DashboardCardMessage;
