// @flow
import api from '../../services/api';
import notification from '../../components/feedback/notification';
import type Moment from 'moment';
import { getCookie, setCookie } from '../../helpers/cookieHelpers';

type State = {
  owners: Object,
  events: Object,
  current: string,
};

type Owner = Object;

type Event = Object;

const updateGuestCount = (
  state: State,
  eventId: string | number,
  count: number
): State => {
  const { owners, current, events } = state;
  const event = events[eventId];
  if (!event) return state;
  const { payment } = event;
  if (payment) {
    payment.spentCredits += count;
    payment.remainingCredits -= count;
  }
  events[eventId] = {
    ...event,
    payment,
  };
  return {
    owners,
    current,
    events,
  };
};

export const initialState = {
  events: {},
  owners: {},
  eventsAreLoaded: false,
  current: getCookie('currentEvent') || '',
};

export default {
  state: initialState,
  reducers: {
    onLoadEvents(state: State, events: Array<Event>): State {
      let { current } = state;
      if (events.length) {
        if (!current) {
          current = events[0].id.toString();
        } else {
          // This prevents a bug when the last "currentEvent" got deleted
          const currentEvent = events.find(ev => ev.id === current);
          if (!currentEvent) {
            current = events[0].id.toString();
          }
        }
      }
      return {
        ...state,
        current,
        eventsAreLoaded: true,
        events: events.reduce((acc, event) => {
          acc[event.id.toString()] = event;
          return acc;
        }, {}),
      };
    },
    onLoadEvent(state: State, event: Event): State {
      const { events } = state;
      events[event.id.toString()] = event;
      return { ...state, events };
    },
    onDeleteEvent(state: State, eventId: number): State {
      let { events, current, owners } = state;
      delete events[eventId];
      delete owners[eventId];
      if (current === eventId) {
        const eventIds = Object.keys(events);
        if (eventIds.length) current = eventIds[0];
        else current = null;
      }
      return {
        ...state,
        events,
        current,
        owners,
      };
    },
    onLoadEventOwners(
      state: Event,
      {
        owners,
        eventId,
      }: {
        owners: Array<Owner>,
        eventId: number,
      }
    ): State {
      const newState = {
        ...state,
      };
      newState.owners[eventId] = owners.reduce((acc, owner) => {
        acc[owner.id] = owner;
        return acc;
      }, {});
      return newState;
    },
    onInvitation(
      state: State,
      {
        invite,
        eventId,
      }: {
        eventId: number,
        invite: Owner,
      }
    ): State {
      const { owners } = state;
      if (!owners[eventId]) owners[eventId] = {};
      owners[eventId][invite.id] = {
        ...invite,
        invitation: true,
      };
      return { ...state, owners };
    },
    onOwnerRemoved(
      state: State,
      {
        eventId,
        ownerId,
      }: {
        eventId: number,
        ownerId: number,
      }
    ): State {
      const { owners } = state;
      if (!owners[eventId]) return state;
      delete owners[eventId][ownerId];
      return { ...state, owners };
    },
    selectEvent(state: State, eventId: number): State {
      setCookie('currentEvent', eventId, 365);
      return {
        ...state,
        current: eventId,
      };
    },
    onActivateEvent(state: State): State {
      return state;
    },
    onHideOnboarding(state: State, eventId: number) {
      return {
        ...state,
        events: {
          ...state.events,
          [eventId]: {
            ...state.events[eventId],
            hideOnboarding: true,
          },
        },
      };
    },
    'Guest/onSaveGuest': (state: State): State =>
      updateGuestCount(state, state.current, 1),
    'Guest/onDeleteGuest': (state: State): State =>
      updateGuestCount(state, state.current, -1),
    'Guest/onBulkUpload': (
      state: State,
      payload: {
        eventId: number,
        added: number,
      }
    ): State => updateGuestCount(state, payload.eventId, payload.added),
  },
  effects: {
    async loadEvents() {
      try {
        const events = await api.getUserEvents();
        this.onLoadEvents(events);
      } 
      catch (e) {
        notification.error({ message: 'Error Loading Events' });
      }
    },
    async saveEvent(payload: { event: Event, cb: Function }) {
      const { event, cb } = payload;
      try {
        const savedEvent = await api.saveEvent(event);
        // Select the new event
        this.selectEvent(savedEvent.id);
        // Saving the updated data in the state
        this.onLoadEvent(savedEvent);
        let message = 'Event Saved';
        if (!event.id) {
          // New Event, go to dashboard
          message = 'Event Created';
        }
        notification.success({ message });
        if (cb) cb(savedEvent, !event.id);
      } catch (e) {
        let message = 'Error Saving Event';
        if (!event.id) message = 'Error Creating Event';
        notification.error({ message });
      }
    },
    async deleteEvent({ eventId, cb }: { eventId: string, cb?: Function }) {
      try {
        await api.deleteEvent(eventId);
        notification.success({ message: 'Event Deleted' });
        this.onDeleteEvent(eventId);
        if (cb) cb();
      } catch (e) {
        notification.error({ message: 'Error Deleting Event' });
      }
    },
    async loadOwners(eventId: number) {
      try {
        const owners = await api.fetchEventOwners(eventId);
        this.onLoadEventOwners({ owners, eventId });
      } catch (e) {
        notification.error({ message: 'Error loading owners' });
      }
    },
    async inviteUser({
      eventId,
      email,
      isPlanner,
    }: {
      eventId: string,
      email: string,
      isPlanner: boolean,
    }) {
      try {
        const invite = await api.inviteUser(eventId, email, isPlanner);
        this.onInvitation({ invite, eventId, isPlanner });
        let message = isPlanner ? 'Planner invited' : 'User invited';
        notification.success({ message: message });
      } catch (e) {
        notification.error({ message: 'Error Inviting User' });
      }
    },
    async removeOwner({
      eventId,
      ownerId,
      invitation,
    }: {
      eventId: number,
      ownerId: number,
      invitation: boolean,
    }) {
      try {
        await api.removeOwner(eventId, ownerId, invitation);
        notification.success({ message: 'User Removed' });
        this.onOwnerRemoved({ eventId, ownerId, invitation });
      } catch (e) {
        notification.error({ message: 'Error Removing User' });
      }
    },
    async activateEvent({
      eventId,
      tokenId,
      price,
      promotion,
      eventDate,
      totalPrice,
      promoId,
      cb,
    }: {
      eventId: number,
      tokenId: string,
      price: number,
      promotion: string | null,
      eventDate: Moment,
      totalPrice: number,
      promoId: Number,
      cb?: () => void,
    }) {
      try {
        const event = await api.activateEvent(
          eventId,
          tokenId,
          price,
          promotion,
          eventDate,
          totalPrice,
          promoId
        );
        this.onActivateEvent(event);
        this.onLoadEvent(event);
        if (cb) {
          cb();
        }
        notification.success({
          message: 'Event activated',
        });
      } catch (e) {
        notification.error({
          message:
            'Sorry, a problem occured while trying to activate your event',
        });
      }
    },
    async toggleStreamPublic({
      eventId,
      isStreamPublic,
    }: {
      eventId: string,
      isStreamPublic: boolean,
    }) {
      try {
        const savedEvent = await api.toggleStreamPublic(
          eventId,
          isStreamPublic
        );
        this.onLoadEvent(savedEvent);
      } catch (e) {
        notification.error({
          message: 'Failed to change stream settings',
        });
      }
    },
    async hideOnboarding(eventId: string) {
      try {
        this.onHideOnboarding(eventId);
        await api.hideOnboarding(eventId);
      } catch (e) {
        notification.error({
          message: 'Failed to save preference.',
        });
      }
    },
  },
  selectors: (slice: Function, createSelector: Function) => ({
    allEvents() {
      return slice(({ events }) => Object.values(events));
    },
    currentEvent() {
      return slice(
        ({ events, current }) => (current ? events[current] : undefined)
      );
    },
    currentEventOwners() {
      return createSelector(
        slice,
        (state, eventId) => eventId,
        ({ owners }, eventId) =>
          eventId && owners[eventId]
            ? Object.values(owners[eventId])
            : undefined
      );
    },
  }),
};
