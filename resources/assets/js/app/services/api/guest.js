import axios from './axios';

const getEventGuests = eventId =>
  axios
    .get(`/events/${eventId}/guests`)
    .then(res => Promise.resolve(res.data.data));

// Get one guest
const getEventGuest = (eventId, guest) =>
  axios
    .get(`/events/${eventId}/guests/${guest}`)
    .then(res => Promise.resolve(res.data.data));

const saveEventGuest = (eventId, guest) => {
  const data = {
    first_name: guest.firstname,
    last_name: guest.lastname,
    phone: guest.phone,
    groups: Object.values(guest.groups),
    country: guest.country,
  };

  const path = `/events/${eventId}/guests${guest.id ? `/${guest.id}` : ''}`;
  const request = guest.id ? axios.put(path, data) : axios.post(path, data);

  return request
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data.data);
      }

      return Promise.reject(
        new Error(
          'Sorry, an error occured while trying to save your guest information.'
        )
      );
    })
    .catch(error => {
      const res = error.response;
      let errorMessage =
        'Sorry, an error occured while trying to save your guest information.';
      if (res.data && res.data.message) {
        errorMessage = res.data.message;
      }
      return Promise.reject(new Error(errorMessage));
    });
};

const bulkUpload = (eventId, guests, groups) =>
  axios
    .post(`/events/${eventId}/guest-bulk-upload`, {
      guests,
      groups,
    })
    .then(res => Promise.resolve(res.data.data));

const deleteGuest = (eventId, guestId) =>
  axios
    .delete(`/events/${eventId}/guests/${guestId}`)
    .then(res => Promise.resolve(res.data.data));

export default {
  getEventGuests,
  saveEventGuest,
  deleteGuest,
  bulkUpload,
  getEventGuest,
};
