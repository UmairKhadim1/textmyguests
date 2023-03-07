import axios from './axios';

const getEventGroups = eventId =>
  axios
    .get(`/events/${eventId}/groups/`)
    .then(res => Promise.resolve(res.data.data));

const getEventGroup = (eventId, groupId) =>
  axios
    .get(`/events/${eventId}/groups/${groupId}`)
    .then(res => Promise.resolve(res.data.data));

const saveEventGroup = (eventId, group) => {
  const data = {
    name: group.name,
    desc: group.desc,
    guests: Object.values(group.guests),
  };
  const path = `/events/${eventId}/groups/${
    group.id ? group.id.toString() : ''
  }`;
  const request = group.id ? axios.put(path, data) : axios.post(path, data);
  return request.then(res => Promise.resolve(res.data.data));
};
const getAllNotifications = async () => {
  const data = await axios.get('web-notifications');
  return Promise.resolve(data);
  // return data;
};
const deleteGroup = (eventId, groupId) =>
  axios
    .delete(`/events/${eventId}/groups/${groupId}`)
    .then(res => Promise.resolve(res.data.data));

export default {
  getEventGroups,
  getEventGroup,
  saveEventGroup,
  deleteGroup,
  getAllNotifications,
};
