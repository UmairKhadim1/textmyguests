import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button, Col, Input, Row } from 'antd';
import store from '../../redux/store';
import EventPlanner from './EventPlanner';

const OwnerRowWrapper = styled.div`
  margin-bottom: 24px;
  padding: 14px;
  background-color: ${props => (props.invitation ? '#fafafa' : '#fff')};
  display: flex;
  align-items: center;

  .name {
    font-weight: 500;
    color: ${props => (props.invitation ? '#555' : '#000')};
    margin-right: 40px;
  }
  .email {
    margin-right: auto;
  }
`;

const OwnerRow = (props: {
  invitation: boolean,
  name: string,
  email: string,
  deleting: boolean,
  onDelete: () => void,
}) => (
  <OwnerRowWrapper invitation={props.invitation}>
    {!props.invitation && <span className="name">{props.name}</span>}
    <span className="email">
      {props.invitation && 'Invitation sent to '}
      {props.email}
    </span>
    <Button
      icon="delete"
      disabled={props.deleting}
      loading={props.deleting}
      onClick={props.onDelete}
      type="danger"
    />
  </OwnerRowWrapper>
);

const Wrapper = styled.div`
  .new-owner {
    display: flex;
    padding: 14px;
    background-color: #fff;
    .input {
      flex: 1 1 auto;
    }
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

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const BasicEventOwnerShip = (props: Props) => {
  const {
    removeOwner,
    loadOwners,
    inviteUser,
    event,
    owners,
    inviting,
    removing,
  } = props;
  const [validEmail, setEmailValidity] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(
    () => {
      if (event) loadOwners(event.id);
    },
    [event]
  );

  const handleEmailChange = e => {
    const { value = '' } = e.target;
    const valid = emailRegex.test(value.trim().toLowerCase());
    setEmail(value.trim().toLowerCase());
    setEmailValidity(valid);
  };

  const handleInviteClick = () => {
    if (event && event.id)
      inviteUser({ eventId: event.id, email, isPlanner: 0 });
  };

  return (
    <Wrapper>
      <Row>
        <Col lg={{ offset: 18, span: 3 }}>
          <EventPlanner />
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 18, offset: 3 }}>
          {(owners || []).map(el => (
            <OwnerRow
              key={`${el.id}:${el.invitation ? 'i' : 'o'}`}
              onDelete={() =>
                removeOwner({
                  eventId: event.id,
                  ownerId: el.id,
                  invitation: el.invitation,
                })
              }
              deleting={removing}
              invitation={el.invitation}
              name={el.name}
              email={el.email}
            />
          ))}
          <div className="new-owner">
            <Input
              onChange={handleEmailChange}
              onPressEnter={handleInviteClick}
              className="input"
              placeholder="Enter an email address"
            />
            <Button
              onClick={handleInviteClick}
              loading={inviting}
              disabled={!validEmail || inviting}
              type="primary">
              Invite user
            </Button>
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
};

const EventOwnerShip = connect(
  state => {
    const event = store.select.Event.currentEvent(state);
    return {
      event,
      owners: event
        ? store.select.Event.currentEventOwners(state, event.id)
        : undefined,
      inviting: state.loading.effects.Event.inviteUser,
      removing: state.loading.effects.Event.removeOwner,
    };
  },
  ({ Event: { loadOwners, removeOwner, inviteUser } }) => ({
    loadOwners,
    inviteUser,
    removeOwner,
  })
)(BasicEventOwnerShip);

export default EventOwnerShip;
