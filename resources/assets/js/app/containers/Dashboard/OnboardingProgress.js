import React from 'react';
import { Progress } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem;

  .title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

type Props = {
  completed: number,
  total: number,
};

class OnboardingProgress extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    const mql = window.matchMedia('(min-width: 768px) and (max-width: 991px)');
    const mql2 = window.matchMedia('(min-width: 576px) and (max-width: 767px)');

    this.state = {
      smallerCircle: mql.matches || mql2.matches,
    };

    mql.onchange = e => {
      this.setState({
        smallerCircle: e.matches || mql2.matches,
      });
    };

    mql2.onchange = e => {
      this.setState({
        smallerCircle: e.matches || mql2.matches,
      });
    };
  }

  render() {
    return (
      <Container>
        <h3 className="title">
          {this.props.completed}/{this.props.total} Tasks Complete
        </h3>
        <Progress
          type="circle"
          width={this.state.smallerCircle ? 180 : 220}
          percent={Math.round(100 * (this.props.completed / this.props.total))}
          strokeWidth={8}
          strokeLinecap="square"
        />
      </Container>
    );
  }
}

export default OnboardingProgress;
