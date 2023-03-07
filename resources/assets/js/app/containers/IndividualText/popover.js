import { Button, Modal } from 'antd';
import { map } from 'lodash';
import React, { useState } from 'react';
import guestsList from '../Guest/guestsList';
import './individual.css';
import './popover.css';

function Popup({ guests, selectedUser }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCurrent, setCurrent] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    selectedUser(isCurrent);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button className="pop-plus" type="primary" onClick={showModal}>
        +
      </Button>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="popover">
        <div className="chats-contacts">
          <div className="contact-add">
            <input className="search-input" type="text" placeholder="Search" />
            {guests &&
              guests.length > 0 &&
              guests.map(member => (
                <div
                  className={`contacts ${isCurrent == member && 'active'}`}
                  onClick={() => {
                    setCurrent(member);
                  }}>
                  <h2>
                    {member.first_name} ({member.phone})
                  </h2>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Popup;
