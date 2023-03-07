import { notification } from 'antd';
import api from '../../services/api';
import Moment from 'moment';

export const initialState = {};

export default {
  state: initialState,
  reducers: {
    onLoadMessages(state, messages = []) {
      return messages.reduce((map, message) => {
        map[message.id.toString()] = message;
        return map;
      }, {});
    },
    onLoadMessage(state, message) {
      const newState = { ...state };
      newState[message.id] = message;
      return newState;
    },
    onSaveMessage(state, message) {
      return {
        ...state,
        [message.id.toString()]: {
          ...message,
          send_at: Moment(message.send_at),
        },
      };
    },
    onToggleStatus(state, { messageId, loading }) {
      return {
        ...state,
        [messageId]: {
          ...state[messageId],
          loading,
        },
      };
    },
    onDeleteMessage(state, messageId) {
      const newState = { ...state };
      delete newState[messageId];
      return newState;
    },
    'Event/selectEvent': () => ({}), // Clear messages
  },
  effects: {
    async loadMessages(eventId) {
      try {
        const messages = await api.getEventMessages(eventId);
        this.onLoadMessages(messages);
      } catch (e) {
        notification.error({
          message: 'Error loading messages',
        });
      }
    },
    async loadMessage({ eventId, messageId }) {
      try {
        const message = await api.getEventMessage(eventId, messageId);
        this.onLoadMessage(message);
      } catch (e) {
        notification.error({
          message: 'Error loading message',
        });
      }
    },
    async saveMessage(payload) {
      const { message, eventId, cb } = payload;
      try {
        const data = await api.saveEventMessage(eventId, message);
        this.onSaveMessage(data.message);
        notification.success({
          message: 'Message saved',
        });
        if (cb) cb(data.message);
      } catch (e) {
        const message = e.message || 'Error saving message';
        notification.error({ message });
      }
    },
    async toggleMessageStatus(payload) {
      const { message, eventId, cb } = payload;
      this.onToggleStatus({ messageId: message.id, loading: true });

      try {
        message.date = message.send_at.format('MM-DD-YYYY');
        message.time = message.send_at.format('h:mm a');
        const data = await api.saveEventMessage(eventId, message);
        this.onSaveMessage(data.message);
        this.onToggleStatus({ messageId: message.id, loading: false });

        const successMessage = message.ready
          ? 'Your message is now enabled and will be sent at the date set.'
          : 'Your message is now disabled and will not be sent.';
        notification.success({ message: successMessage });

        if (cb) cb(data.message);
      } catch (e) {
        const errorMessage =
          e.message ||
          'An error occured while updating the status of your message.';
        notification.error({ message: errorMessage });
        this.onToggleStatus({ messageId: message.id, loading: false });
      }
    },
    async deleteMessage(payload) {
      const { eventId, messageId, cb } = payload;
      try {
        const messages = await api.deleteMessage(eventId, messageId);
        this.onLoadMessages(messages);
        notification.success({ message: 'Message deleted' });
        if (cb) cb();
      } catch (e) {
        notification.error({
          message: 'Error deleting message',
        });
      }
    },
    async optOutPromotion(payload: {
      eventId: string,
      promotion: string,
      token: string,
      price: number,
    }) {
      try {
        const messages = await api.optOutPromotion(
          payload.eventId,
          payload.promotion,
          payload.token,
          payload.price
        );
        this.onLoadMessages(messages);
      } catch (e) {
        notification.error({
          message:
            'Sorry, an error occured while opting you out of the promotion. Please contact us.',
        });
      }
    },
    async optInPromotion(payload: {
      eventId: string,
      promotion: string,
      refund: number,
      invoiceId: string,
      cb: () => void,
    }) {
      try {
        const messages = await api.optInPromotion(
          payload.eventId,
          payload.promotion,
          payload.refund,
          payload.invoiceId
        );
        this.onLoadMessages(messages);
        if (payload.cb) {
          payload.cb();
        }
        notification.success({
          message: 'Promotion was succesfully applied.',
        });
      } catch (e) {
        notification.error({
          message:
            'Sorry, an error occured while applying the promotion. Please contact us.',
        });
      }
    },
  },
  selectors: (slice, createSelector) => ({
    allMessages() {
      return slice(messages => Object.values(messages));
    },
    messageById() {
      return createSelector(
        slice,
        (state, messageId) => messageId,
        (messages, messageId) => messages[messageId]
      );
    },
  }),
};


// getEventMessages,
// getEventMessage,
// saveEventMessage,
// deleteMessage,
// optOutPromotion,
// optInPromotion,
// uploadImage,