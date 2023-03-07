import { notification } from 'antd';
import api from '../../services/api';
export const initialState = { chat: [], chatContacts: []};

export default {
  state: initialState,
  reducers: {
    onLoadDirectChat(state, chat = []) {
      return { ...state, chat: chat };
    },

    singleMessage(state, message) {
      return { ...state, chat: [...state.chat, message] };
    },

    onLoadAllRecipient(state, chatContacts = []) {
      return { ...state, chatContacts: chatContacts };
    },

    onLoadGuestMessage(state, chat = []) {
      return { ...state, chat: chat };
    },




    // onLoadGuestMessage(state, guestMessages = []) {
    //   return { ...state, guestMessages: guestMessages };
    // },

  },
  // EFFECTS
  effects: {
    async loadChat(payload) {
      try {
        const res = await api.getDirectChat(payload);
        this.onLoadDirectChat(res.data.message);
      } catch (e) {
        notification.error({
          message: 'Error loading chat',
        });
      }
    },

    async loadPostDirectChat(payload) {
      try {
        const res = await api.postDirectChatData(payload);
        this.singleMessage(res);
      } catch (e) {
        notification.error({
          message: 'An error occured while changing message visibility',
        });
      }
    },

    async loadAllRecipient(payload) {
      try {
        const res = await api.getAllRecipientDirectChat(payload);
        console.log('response of recipents api *********&&&&&&&********:', res);
        this.onLoadAllRecipient(res);
      } catch (e) {
        notification.error({
          message: 'An error occured while on load AllRecipient',
        });
      }
    },

    async loadGuestMessage(payload) {
      try {
        const res = await api.getGuestMessagesApi(payload);
        this.onLoadGuestMessage(res);
      } catch (e) {
        notification.error({
          message: "An error occured while on load guestmessages',",
        });
      }
    },
  },

  // SELECTORS
  selectors: (slice, createSelector) => ({
    allChat() {
      return slice(({ chat }) => chat);
    },
    allChatContacts() {
      return slice(({ chatContacts }) => chatContacts);
    },
    allGuestMessage() {
      return slice(({ chat }) => chat);
    },
  }),
};
