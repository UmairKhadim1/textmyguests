import axios from './axios';

const getReplyStream = eventId =>
  axios.get(`events/${eventId}/reply-stream`).then(res => {
    if (res.status === 200 && res.data.status === 'success') {
      return Promise.resolve(res.data.data);
    }
    return Promise.reject(new Error('Request failed'));
  });

const toggleHiddenReply = (eventId, payload) =>
  axios.post(`events/${eventId}/toggle-hidden-reply`, payload).then(res => {
    if (res.status === 200 && res.data.status === 'success') {
      return Promise.resolve(true);
    }

    return Promise.reject(new Error('Request failed'));
  });

export default {
  getReplyStream,
  toggleHiddenReply,
};
