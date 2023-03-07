import Moment from 'moment';
import axios from './axios';

const getEventMessages = eventId =>
  axios.get(`/events/${eventId}/messages/`).then(res => {
    if (res.status === 200) {
      return Promise.resolve(
        res.data.data.messages.map(message => ({
          ...message,
          send_at: Moment(message.send_at),
        }))
      );
    }
    return Promise.reject(new Error('Request failed'));
  });

const getEventMessage = (eventId, messageId) =>
  axios.get(`/events/${eventId}/messages/${messageId}`).then(res => {
    if (res.status === 200) {
      const { message } = res.data.data;
      return Promise.resolve({
        ...message,
        send_at: Moment(message.send_at),
      });
    }
    return Promise.reject(new Error('Request failed'));
  });

const saveEventMessage = (eventId, message) => {
  const data = {
    contents: message.content,
    image: message.image,
    thumbnail: message.thumbnail,
    time: message.time,
    date: message.date,
    all: message.all,
    ready: message.ready,
    immediately: message.immediately || false,
    recipients: Object.values(message.recipients),
    testMessage:message.testMessage
  };
  const path = `/events/${eventId}/messages${
    message.id ? `/${message.id}` : ''
  }`;
  const request = message.id ? axios.put(path, data) : axios.post(path, data);
  return request
    .then(res => {
      if (res.status === 200) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error('Request failed'));
    })
    .catch(error => {
      if (error.response) {
        // Server responded
        const res = error.response;
        const data = res.data ? (res.data.data ? res.data.data : null) : null;
        if (data) {
          return Promise.reject(new Error(data.message));
        }
      }
      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    });
};

const deleteMessage = (eventId, messageId) =>
  axios.delete(`/events/${eventId}/messages/${messageId}`).then(res => {
    if (res.status === 200 && res.data.status === 'success') {
      return Promise.resolve(
        res.data.data.messages.map(message => ({
          ...message,
          send_at: Moment(message.send_at),
        }))
      );
    }
    return Promise.reject(new Error('Request failed'));
  });

const optOutPromotion = (
  eventId: string,
  promotion: string,
  token: string,
  price: number
) =>
  axios
    .post(`events/${eventId}/opt-out`, { promotion, token, price })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(
          res.data.data.messages.map(message => ({
            ...message,
            send_at: Moment(message.send_at),
          }))
        );
      }
      return Promise.reject(new Error('Request failed'));
    });

const optInPromotion = (
  eventId: string,
  promotion: string,
  refund: number,
  invoiceId: number
) =>
  axios
    .post(`events/${eventId}/opt-in`, {
      promotion,
      price: refund,
      invoice_id: invoiceId,
    })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(
          res.data.data.messages.map(message => ({
            ...message,
            send_at: Moment(message.send_at),
          }))
        );
      }
      return Promise.reject(new Error('Request failed'));
    });

const uploadImage = (eventId: string, formData) =>
  axios
    .post(`events/${eventId}/image-upload`, formData)
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data.data);
      }

      return Promise.reject(new Error('Request failed'));
    })
    .catch(
      () => Promise.reject(new Error('Request failed')) // TODO detailed error handling
    );

export default {
  getEventMessages,
  getEventMessage,
  saveEventMessage,
  deleteMessage,
  optOutPromotion,
  optInPromotion,
  uploadImage,
};
