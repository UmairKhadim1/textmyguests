import axios from './axios';

const sendContactMessage = (subject: string, message: string) =>
  axios
    .post('/contact-us', { subject, message })
    .then(res => Promise.resolve(res));

export default {
  sendContactMessage,
};
