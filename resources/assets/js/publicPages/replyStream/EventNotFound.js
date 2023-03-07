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
  margin-bottom: 20px;
  font-size: 3rem;
  text-align: center;
`;

const EventNotFound = () => (
  <CenteredRow>
    <Col md={18}>
      <Title>Event not found</Title>
      <Message>
        The event your are trying to access does not exist or is not public.
      </Message>
    </Col>
  </CenteredRow>
);

export default EventNotFound;
