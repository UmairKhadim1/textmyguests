import api from '../../services/api';

export const initialState = {
  notifications: {},
  next_url: '',
  next_page: false,
};

export default {
  state: initialState,
  reducers: {
    onLoadNotifications(state = initialState, notifications) {
      console.log('notifications', notifications);
      let pushnotify = notifications.data.reduce((map, noti) => {
        map[noti.id] = noti;
        return map;
      }, {});
      return {
        ...state,
        ...pushnotify,
        next_page: notifications.next_page_url ? true : false,
        next_page_url: notifications.next_page_url,
      };
    },
    onLoadNotification(state = initialState, notifications) {
      // console.log('redux', notifications);
      var data = {
        id: notifications.id,
        data: notifications,
        created_at: Date.now(),
      };
      var temp = {};
      temp[notifications.id] = data;
      // console.log('temp', temp);
      return { ...temp, ...state };
    },
  },
  effects: {
    async loadNotifications() {
      try {
        const { data } = await api.getAllNotifications();
        this.onLoadNotifications(data);
      } catch (e) {
        // console.log(e);
      }
    },
    loadNotification(data) {
      try {
        // console.log('notification', data);
        this.onLoadNotification(data);
      } catch (e) {
        // console.log(e);
      }
    },
    async loadMore(url) {
      try {
        // console.log('load more');
        const { data } = await api.getMoreData(url);
        // console.log('data', data);
        this.onLoadNotifications(data);
      } catch (e) {
        console.log(e);
      }
    },
  },
  selectors: (slice, createSelector) => ({
    allNotifications() {
      // return slice(notifications => console.log(notifications));
      // return 'abc';
      return slice(notifications => Object.values(notifications));
    },
  }),
};
