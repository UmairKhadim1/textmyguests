import user from './user';
import event from './event';
import message from './message';
import guest from './guest';
import group from './group';
import contact from './contact';
import invoice from './invoice';
import reply from './reply';
import test from './test';
import direct from './direct';

const api = {
  ...user,
  ...event,
  ...message,
  ...guest,
  ...direct,
  ...group,
  ...contact,
  ...invoice,
  ...reply,
  ...test,
};

export default api;
