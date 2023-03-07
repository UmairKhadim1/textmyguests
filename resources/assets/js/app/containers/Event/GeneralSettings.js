import React from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Popconfirm } from 'antd';
import EditEvent from './editEvent';
import store from '../../redux/store';

type DeleteEventProps = {
  deleting: boolean,
  onDeleteEvent: () => void,
};

const DeleteEvent = (props: DeleteEventProps) => (
  <div
    style={{
      textAlign: 'center',
      border: '1px solid #ff4d4f',
      padding: '10px',
    }}>
    <h3 style={{ marginBottom: '10px' }}>Delete Event</h3>
    <p style={{ marginBottom: '20px' }}>
      Once you delete this event, there&apos;s no going back!
    </p>
    <Popconfirm
      title="Are you really sure?"
      okType="danger"
      okText="Yes, I am"
      cancelText="No, I am  not"
      onConfirm={props.onDeleteEvent}>
      <Button type="danger" loading={props.deleting} disabled={props.deleting}>
        Delete Event
      </Button>
    </Popconfirm>
  </div>
);

type Props = {
  event: Object,
  deleting: boolean,
  deleteEvent: ({ eventId: string, cb?: () => void }) => void,
};

const GeneralSettings = (props: Props) => {
  const { event, deleting, deleteEvent } = props;
  const onDeleteEvent = () => {
    if (event) {
      deleteEvent({ eventId: event.id });
    }
  };

  return (
    <div>
      <EditEvent event={event} />
      <Divider />
      <DeleteEvent deleting={deleting} onDeleteEvent={onDeleteEvent} />
    </div>
  );
};

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    deleting: state.loading.effects.Event.deleteEvent,
  }),
  ({ Event: { deleteEvent } }) => ({
    deleteEvent,
  })
)(GeneralSettings);
