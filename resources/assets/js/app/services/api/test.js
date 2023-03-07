import axios from './axios';

const getAllNotifications = async () => {
  const data = await axios.get('web-notifications');
  return Promise.resolve(data);
  // return data;
};
const getMoreData = async url => {
  const data = await axios.get(url);
  return Promise.resolve(data);
};

export default {
  getAllNotifications,
  getMoreData,
};
