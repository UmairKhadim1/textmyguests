import React from 'react';
import { Row, Col, Button } from 'antd';
import OnboardingTaskList from './OnboardingTaskList';
import OnboardingProgress from './OnboardingProgress';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding: 20px 40px;
  background: white;

  > div {
    flex-grow: 1;
  }

  .progress-container {
    display: flex;
    justify-content: center;
  }

  .hide-button {
    margin-top: 1.25rem;
  }

  @media only screen and (min-width: 576px) and (max-width: 768px) {
    align-items: center;
  }

  @media only screen and (min-width: 768px) and (max-width: 991px),
    screen and (max-width: 575px) {
    padding: 20px 10px;
    flex-direction: column;
    align-items: center;

    .progress-container {
      order: 1;
      margin-bottom: 1rem;
    }

    .task-list-container {
      order: 2;
      .hide-button-container {
        text-align: center;
        margin-top: 0.35rem;
      }
    }
  }
`;

type Props = {
  messageCount: number,
  guestCount: number,
  groupCount: number,
  eventIsActivated: boolean,
  hideOnboarding: () => void,
};

const Onboarding: React.FC = (props: Props) => {
  let completed = 1;
  if (props.messageCount > 0) {
    completed++;
  }
  if (props.guestCount > 1) {
    completed++;
  }
  if (props.groupCount > 2) {
    completed++;
  }
  if (props.eventIsActivated > 0) {
    completed++;
  }

  return (
    <Row type="flex" justify="center" style={{ padding: '35px 0px' }}>
      <Col xs={24} md={24} lg={20} xl={20}>
        <Wrapper>
          <div className="task-list-container">
            <OnboardingTaskList
              messageCount={props.messageCount}
              guestCount={props.guestCount}
              groupCount={props.groupCount}
              eventIsActivated={props.eventIsActivated}
            />
            <div className="hide-button-container">
              <Button className="hide-button" onClick={props.hideOnboarding}>
                Dismiss setup wizard
              </Button>
            </div>
          </div>
          <div className="progress-container">
            <OnboardingProgress completed={completed} total={5} />
          </div>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Onboarding;
