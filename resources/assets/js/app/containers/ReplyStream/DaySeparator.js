import React from 'react';
import styled from 'styled-components';
import Moment from 'moment';

const DayWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .day {
    display: block;
    padding: 6px 20px;
    border-radius: 100px;
    color: ${props => props.theme.palette.grayscale[0]};
  }

  .line-separator {
    flex-grow: 1;
    > div {
      height: 50%;

      &:first-child {
        border-bottom: 1px solid ${props => props.theme.palette.grayscale[0]};
      }
    }
  }
`;

const DaySeparator = (props: { day: string }) => (
  <DayWrapper>
    <div className="line-separator">
      <div />
      <div />
    </div>
    <span className="day">{Moment(props.day).format('MMMM Do, YYYY')}</span>
    <div className="line-separator">
      <div />
      <div />
    </div>
  </DayWrapper>
);

export default DaySeparator;
