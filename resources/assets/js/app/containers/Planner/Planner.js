import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import store from '../../redux/store';
import AddPlanner from './AddPlanner';

const Container = styled.div`
  padding: 0.75rem 0rem;
  display: flex;
  align-items: center;
  cursor: pointer;

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
  owners: Array<Object>,
  event?: Object,
  loadOwners: string => void,
  inviteUser: Function,
  removeOwner: Function,
  inviting: boolean,
  removing: boolean,
};

const Planner = (props: Props) => {
  const { inviteUser, event, inviting } = props;
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
    // console.log(visible);
  };
  const showModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  const handleInviteClick = (email, isPlanner) => {
    if (event && event.id) inviteUser({ eventId: event.id, email, isPlanner });
    // console.log(email, isPlanner);
    closeModal();
  };
  return (
    <>
      <Container onClick={handleClick}>
        <div className="icon">
          <i className="ion-checkmark" />
        </div>
        <div className="label">Add Planner</div>
      </Container>
      <Modal
        visible={visible}
        onCancel={closeModal}
        title="Add Planner to this Event"
        footer={null}>
        <AddPlanner visible={visible} submitHandler={handleInviteClick} />
      </Modal>
    </>
  );
};
const EventPlanner = connect(
  state => {
    const event = store.select.Event.currentEvent(state);
    return {
      event,
      owners: event
        ? store.select.Event.currentEventOwners(state, event.id)
        : undefined,
      inviting: state.loading.effects.Event.inviteUser,
    };
  },
  ({ Event: { loadOwners, inviteUser } }) => ({
    loadOwners,
    inviteUser,
  })
)(Planner);
export default EventPlanner;
