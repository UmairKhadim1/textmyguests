import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 0.75rem 0rem;
  display: flex;
  align-items: center;

  .icon {
    background: ${({ completed, theme }) =>
      completed ? theme.palette.success[0] : theme.palette.primary[0]};
    border-radius: 5rem;
    margin-right: 1rem;
    color: white;
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 18px;
  }

  .label {
    flex-grow: 1;
    font-size: 16px;
    color: ${({ completed, theme }) =>
      completed ? theme.palette.success[0] : 'inherit'};
  }
`;

type Props = {
  icon: React.ReactElement,
  label: string | React.ReactElement,
  completed: boolean,
  link: string,
};

const OnboardingTask: React.FC = (props: Props) => (
  <Container completed={props.completed}>
    <Link to={props.link}>
      <div className="icon">
        {props.completed ? <i className="ion-checkmark" /> : props.icon}
      </div>
    </Link>
    <div className="label">{props.label}</div>
  </Container>
);

export default OnboardingTask;
