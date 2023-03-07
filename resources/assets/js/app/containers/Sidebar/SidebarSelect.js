// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import store from '../../redux/store';
import Select, { SelectOption } from '../../components/uielements/select';
import SelectStyle from './SidebarSelect.style';

type Props = {
  selected?: Object,
  events: Array<Object>,
  selectEvent: string => void,
  history: Object,
  className: string,
};

const SidebarSelect = (props: Props) => {
  const handleChange = value => {
    const { history, selectEvent } = props;
    let to = '/dashboard';
    if (value === 'new') {
      // Create new Event
      to = '/dashboard/new-event';
    } else {
      selectEvent(value.toString());
    }
    history.push(to); // move
  };

  const selected = props.selected || {};
  return (
    <div
      className={`${props.className} root`}
      style={{ position: 'relative' }}
      id="selectArea">
      <Select
        value={selected.id}
        onChange={handleChange}
        getPopupContainer={() => document.getElementById('selectArea')}>
        <SelectOption value="new" title={'Create New Event'}>
          Create New Event
        </SelectOption>
        {props.events.map(event => (
          <SelectOption key={event.id} value={event.id} title={event.name}>
            {event.name}
          </SelectOption>
        ))}
      </Select>
    </div>
  );
};

export default connect(
  state => ({
    events: store.select.Event.allEvents(state),
    selected: store.select.Event.currentEvent(state),
  }),
  ({ Event }) => ({
    selectEvent: Event.selectEvent,
  })
)(withRouter(SelectStyle(SidebarSelect)));
