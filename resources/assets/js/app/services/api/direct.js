import { promised } from 'q';
import { resolve } from 'url';
import axios from './axios';

const getDirectChat = ({ receiver_id, eventID }) => {
  console.log('(*)(*)(*)(*)(*)(*)(*)(*)(*)(*)(*)(*))', receiver_id, eventID);
  return new Promise((resolve, reject) => {
    axios
      .get(`/chat-message/${eventID}`, { params: { receiver_id } })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data);
        }
        reject('error');
      })
      .catch(err => reject('error', err));
  });
};

const postDirectChatData = ({
  receiver_id,
  contents,
  image,
  thumbnail,
  eventID,
}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/chat-message/${eventID}`, {
        receiver_id,
        contents,
        image,
        thumbnail,
      })
      .then(res => {
        if (res.status === 200 && res.data.status === 'success') {
          return resolve(res.data.data.message);
        }
        return reject(new Error('Request failed'));
      });
  });
};

const getAllRecipientDirectChat = ({ receiver_id, eventID }) => {
  console.log('getAllRecipient', receiver_id, eventID);
  return new Promise((resolve, reject) => {
    axios
      .get(`/allRecipents/${eventID}`, { params: { receiver_id } })
      .then(res => {
        if (res.status === 200 && res.data.status === 'success') {
          resolve(res.data.data.data);
        }
        reject('error');
      })
      .catch(err => reject('error', err));
  });
};

const getGuestMessagesApi = ({ guest_id, eventID }) => {
  console.log('demo');
  console.log('getGuestMessagesApi', guest_id, eventID);
  return new Promise((resolve, reject) => {
    axios
      .get(`/guest-messages/${eventID}`, { params: { guest_id } })
      .then(res => {
        console.log('hello', res);
        if (res.status === 200 && res.data.status === 'success') {
          resolve(res.data.data.data);
        }
        console.log('error here', res);
        reject('error');
      })
      .catch(err => reject('error', err));
  });
};

export default {
  getDirectChat,
  postDirectChatData,
  getAllRecipientDirectChat,
  getGuestMessagesApi,
};
