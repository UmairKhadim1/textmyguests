import React from 'react';
import { Icon, Tooltip } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.span`
  display: inline-block;
  margin-left: 4px;
`;

const HelpTooltip = props => (
  <Wrapper>
    <Tooltip {...props}>
      <Icon type="info-circle"/>
    </Tooltip>
  </Wrapper>
);

HelpTooltip.defaultProps = Tooltip.defaultProps;
HelpTooltip.propTypes = Tooltip.propTypes;

export default HelpTooltip;
