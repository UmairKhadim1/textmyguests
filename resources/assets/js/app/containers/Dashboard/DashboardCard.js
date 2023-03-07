import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 30px 10px;
  width: 100%;

  @media only screen and (min-width: 1200px) {
    height: 100%;
  }

  @media only screen and (max-width: 1199px) {
    height: 100%;
    align-items: center;
  }
`;

export const Title = styled.h1`
  text-transform: uppercase;
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Count = styled.div`
  font-size: 60px;
  line-height: 1;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const CallToAction = styled(Link)`
  display: block;
  font-size: 14px;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  label: string,
  count: number,
  callToAction: string,
  callToActionLink: string,
  loading: boolean,
};

const DashboardCard = (props: Props) => {
  const { label, count, callToAction, callToActionLink, loading } = props;

  if (loading) {
    return (
      <CardWrapper style={{ minheight: '200px', justifyContent: 'center' }}>
        <Spin />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Title>{label}</Title>
      <Count>{count}</Count>
      <CallToAction to={callToActionLink}>
        {callToAction}
        <i className="ion-arrow-right-c" style={{ marginLeft: '5px' }} />
      </CallToAction>
    </CardWrapper>
  );
};

export default DashboardCard;
