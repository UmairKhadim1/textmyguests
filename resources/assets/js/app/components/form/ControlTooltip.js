import React from 'react';
import HelpTooltip from '../uielements/HelpTooltip';

const ControlTooltip = ({
  title,
  align = 'center',
  children,
  ...props
}: {
  title?: string,
  align?: string,
  children?: any,
}) => (
  <div style={{ display: 'flex', alignItems: align }}>
    {React.cloneElement(children, props)}
    <HelpTooltip title={title} />
  </div>
);

export default ControlTooltip;
