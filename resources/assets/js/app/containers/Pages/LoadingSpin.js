import { Spin, Icon } from 'antd';
import React from 'react';

function LoadingSpin() {
  const antIcon = <Icon type="loading" style={{ fontSize: 70 }} spin />;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}>
      <Spin indicator={antIcon} />
    </div>
  );
}

export default LoadingSpin;
