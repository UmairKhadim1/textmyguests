import React from 'react';
import './Partner.css';
import { Button } from 'antd';

function Partnership() {
  return (
    <div className="d-flex">
      <h4>Do you want to join our Partnership Program ?</h4>
      <div style={{ display: 'flex' }}>
        <Button>Yes</Button>
        <Button>No</Button>
      </div>
    </div>
  );
}

export default Partnership;
