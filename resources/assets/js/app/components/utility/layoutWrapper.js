import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

type Props = {
  className: ?string,
};

const LayoutWrapper: React.FC = (props: Props) => (
  <LayoutContentWrapper
    className={
      props.className
        ? `${props.className} isoLayoutContentWrapper`
        : 'isoLayoutContentWrapper'
    }
    {...props}>
    {props.children}
  </LayoutContentWrapper>
);

export default LayoutWrapper;
