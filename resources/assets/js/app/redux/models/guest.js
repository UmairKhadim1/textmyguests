// @flow
import { notification } from 'antd';
import api from '../../services/api';

type State = Object;
type Guest = Object;

export const initialState = {};

export default {
  state: initialState,
  reducers: {
    onLoadGuests(state: State, guests: Array<Guest> = []): Guest {
      return guests.reduce((map, guest) => {
        map[guest.id] = guest;
        // console.log(guest)
        return map;
      }, {});
    },
    onLoadGuest(state: State, guest: Guest): State {
      if (guest && guest.id) {
        return {
          ...state,
          [guest.id]: guest,
        };
      }
      return state;
    },
    onSaveGuest(state: State): State {
      return state;
    },
    onDeleteGuest(state: State, guestId: number): State {
      const newState = { ...state };
      delete newState[guestId];
      return newState;
    },
    onBulkUpload(state: State): State {
      return state;
    },
    'Event/selectEvent': () => ({}), // Clear
  },
  effects: {
    async loadGuests(eventId: number) {
      try {
        const { guests } = await api.getEventGuests(eventId);

        this.onLoadGuests(guests);
        // console.log(guests);
      } catch (e) {
        notification.error({
          message: 'Error loading guests',
        });
      }
    },
    async loadGuest(payload: { eventId: number, guestId: number }) {
      try {
        const { eventId, guestId } = payload;
        const { guest } = await api.getEventGuest(eventId, guestId);
        this.onLoadGuest(guest);
      } catch (e) {
        notification.error({ message: 'Error Loading Guest' });
      }
    },
    async saveGuest(payload: { eventId: number, guest: Guest, cb: Function }) {
      const { eventId, guest, cb } = payload;
      try {
        const data = await api.saveEventGuest(eventId, guest);
        let message = 'Guest saved';
        if (!guest.id) {
          // New Guest, go to dashboard
          message = 'Guest created';
        }
        notification.success({ message });
        this.onSaveGuest(data.guest);
        this.onLoadGuest(data.guest);
        if (cb) cb();
      } catch (e) {
        let message =
          e.message ||
          'Sorry, an error occured while trying to save your guest information.';
        notification.error({ message });
      }
    },
    async deleteGuest(payload: {
      eventId: number,
      guestId: number,
      cb: Function,
    }) {
      const { eventId, guestId, cb } = payload;
      try {
        await api.deleteGuest(eventId, guestId);
        this.onDeleteGuest(guestId);
        notification.success({ message: 'Guest deleted' });
        if (cb) cb();
      } catch (e) {
        notification.error({ message: 'Error deleting guest' });
      }
    },
    async bulkUploadGuests({
      guests,
      eventId,
      groups,
      cb,
    }: {
      eventId: number,
      groups: Array<{ id: number }>,
      guests: Array<Guest>,
      cb: Function,
    }) {
      try {
        const result = await api.bulkUpload(eventId, guests, groups);

        let message = `Added ${result.added} guests and updated ${
          result.updated
        }`;
        if (result.invalid) {
          message = `Added ${result.added} guests, updated ${
            result.updated
          } and ${result.invalid} invalid numbers.`;
        }

        notification.success({ message });
        result.eventId = eventId;
        this.onBulkUpload(result);
        if (cb) cb(result);
      } catch (e) {
        notification.error({
          message: 'Sorry, an error occured while trying to upload your guests',
        });
      }
    },
  },
  selectors: (slice, createSelector) => ({
    allGuests() {
      return slice(guests =>
        Object.values(guests).sort(function(a, b) {
          if (a.last_name && !b.last_name) return -1;
          if (b.last_name && !a.last_name) return 1;
          const aName = `${a.last_name}${a.last_name ? ', ' : ''}${
            a.first_name
          }`;
          const bName = `${b.last_name}${b.last_name ? ', ' : ''}${
            b.first_name
          }`;
          if (aName < bName) return -1;
          if (aName > bName) return 1;
          return 0;
        })
      );
    },
    guestById() {
      return createSelector(
        slice,
        (state, guestId) => guestId,
        (guests, guestId) => guests[guestId]
      );
    },
  }),
};
