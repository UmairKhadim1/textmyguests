import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const CenteredRow = styled(Row)`
  display: flex !important;
  justify-content: center !important;
`;

const Message = styled.div`
  margin-bottom: 50px;
  color: #555;
  font-size: 18px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-size: 2rem;
  text-align: center;
`;

const EmptyStream = () => (
  <CenteredRow>
    <Col md={18}>
      <Title>No message yet</Title>
      <Message>No message was sent for this event</Message>
    </Col>
  </CenteredRow>
);

export default EmptyStream;
