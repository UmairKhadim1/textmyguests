import React from 'react';
import Stream from './Stream';
import { repliesByDay } from './demoData';
import styled from 'styled-components';

const Title = styled.h3`
  text-align: center;
  margin-bottom: 0.5rem;
  opacity: 0.35;
`;

const DemoContainer = styled.div`
  margin-top: 10px;
  opacity: 0.6;
`;

const DemoStream = () => (
  <DemoContainer>
    <Title>This is a demonstration stream.</Title>
    <Stream repliesByDay={repliesByDay} />
  </DemoContainer>
);

export default DemoStream;
