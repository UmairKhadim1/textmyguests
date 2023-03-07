// @flow
import moment from 'moment-timezone';
import axios from './axios';
import type { ID, Event } from '../../type';

function transformToEvent(e: Object): Event {
  const event: Event = {
    id: e.id,
    name: e.name,
    location: e.location,
    timezone: e.timezone,
    eventDate: e.eventDate ? moment(e.eventDate) : null,
    isStreamPublic: e.isStreamPublic,
    textToJoin: e.textToJoin,
    showJoinButton: e.showJoinButton,
    phoneNumbers: e.phoneNumbers,
    hideOnboarding: e.hideOnboarding,
    expiry: e.expiry,
  };
  if (e.payment) {
    event.payment = {
      activated: e.payment.activated,
      totalCredits: e.payment.total_credits,
      spentCredits: e.payment.spent_credits,
      remainingCredits: e.payment.remaining_credits,
      discount: e.payment.discount,
      discountOwner: e.payment.discount_owner,
    };
  }
  return event;
}

/**
 * Get the lists of events from the backend
 *
 * @returns {Promise} Promise containing the list of event
 */
const getUserEvents = (): Promise<Array<Event>> =>
  axios.get('/events').then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data.data.map(transformToEvent));
    }
    return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
  });

const getDashboardData = (id: string): Promise<Object> =>
  axios.get(`/events/${id}/dashboard`).then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data.data);
    }
    return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
  });

const saveEvent = (event: Object): Promise<Event> => {
  const {
    name,
    location,
    timezone,
    event_date,
    text_to_join,
    show_join_button,
  } = event;

  const data = {
    name,
    location,
    timezone,
    event_date,
    text_to_join,
    show_join_button,
  };

  const request = event.id
    ? axios.put(`/events/${event.id}`, data)
    : axios.post('/events', data);
  return request.then(res => {
    if (res.status === 200) {
      return Promise.resolve(transformToEvent(res.data.data));
    }
    return Promise.reject(new Error('Request failed'));
  });
};

const deleteEvent = (id: ID): Promise<ID> =>
  axios.delete(`/events/${id}`).then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data.data);
    }
    return Promise.reject(new Error('Request failed'));
  });

const fetchEventOwners = (id: ID) =>
  axios.get(`/events/${id}/owners`).then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data);
    }
    return Promise.reject(new Error('Request failed'));
  });

const inviteUser = (
  id: ID,
  email: string,
  isPlanner: boolean
): Promise<Object> =>
  axios
    .post(`/events/${id}/invite`, {
      email,
      isPlanner,
    })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error('Request failed'));
    });

const removeOwner = (
  eventId: ID,
  id: ID,
  invitation: boolean
): Promise<Object> =>
  axios
    .delete(`/events/${eventId}/${invitation ? 'invite' : 'owner'}/${id}`, {
      id,
    })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error('Request failed'));
    });

const activateEvent = (
  eventId: string,
  tokenId: string,
  price: number,
  promotion: string | null,
  eventDate: moment,
  totalPrice: number,
  promoId: Number
): Promise<Event> =>
  axios
    .post(`/events/${eventId}/activate-event`, {
      token: tokenId,
      price,
      promotion,
      event_date: eventDate,
      totalPrice,
      promoId,
    })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(transformToEvent(res.data.data));
      }
      return Promise.reject(new Error('Request Failed'));
    });

const toggleStreamPublic = (eventId: string, isStreamPublic: boolean) =>
  axios
    .post(`events/${eventId}/toggle-stream-public`, {
      isStreamPublic,
    })
    .then(res => Promise.resolve(transformToEvent(res.data.data)));

const hideOnboarding = (eventId: string) =>
  axios
    .get(`events/${eventId}/hide-onboarding`)
    .then(res => Promise.resolve(transformToEvent(res.data.data)));

export default {
  getUserEvents,
  getDashboardData,
  saveEvent,
  deleteEvent,
  fetchEventOwners,
  inviteUser,
  removeOwner,
  activateEvent,
  toggleStreamPublic,
  hideOnboarding,
};
