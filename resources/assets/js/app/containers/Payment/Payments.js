// @flow
import React from 'react';
import styled from 'styled-components';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';

const Wrapper = styled.div`
  padding: 40px 0;
  color: #555;
  font-weight: 500;
  font-size: 24px;
  text-align: center;
`;

type Props = {};

class Payments extends React.Component<Props> {
  render() {
    return (
      <LayoutWrapper>
        <PageHeader>
          <span className="title">Payments</span>
        </PageHeader>
        <Wrapper>Payments Coming Soon</Wrapper>
      </LayoutWrapper>
    );
  }
}

export default Payments;
