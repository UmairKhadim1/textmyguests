import { notification } from 'antd';
import Moment from 'moment';
import api from '../../services/api';

export const initialState = {};

export default {
  state: initialState,
  reducers: {
    onLoadReplies(state, replies = []) {
      return replies.reduce((acc, reply) => {
        acc[reply.type + '_' + reply.id] = reply;
        return acc;
      }, {});
    },
    onToggleHidden(state, payload) {
      const id = [payload.type + '_' + payload.id];
      return {
        ...state,
        [id]: {
          ...state[id],
          hidden: payload.hidden,
          loading: false,
        },
      };
    },
    onHiding(state, payload) {
      const id = [payload.type + '_' + payload.id];
      return {
        ...state,
        [id]: {
          ...state[id],
          hidden: false,
          loading: true,
        },
      };
    },
    onToggleHiddenFailure(state, payload) {
      const id = [payload.type + '_' + payload.id];
      return {
        ...state,
        [id]: {
          ...state[id],
          hidden: !payload.hidden,
          loading: false,
        },
      };
    },
    'Event/selectEvent': () => ({}), // Clear messages
  },
  effects: {
    async loadReplies(eventId: string) {
      try {
        const replies = await api.getReplyStream(eventId).then(replies =>
          replies.map(reply => {
            if (reply.received_at)
              reply.received_at = Moment(reply.received_at);
            return reply;
          })
        );
        this.onLoadReplies(replies);
      } catch {
        notification.error({
          message: 'Error loading messages',
        });
      }
    },
    async toggleHidden(payload: {
      eventId: string,
      type: string,
      id: number,
      hidden: boolean,
    }) {
      this.onHiding(payload);

      try {
        if (payload.type === 'message') {
          await api.toggleHiddenReply(payload.eventId, {
            message_id: payload.id,
            hidden: payload.hidden,
          });
        } else if (payload.type === 'reply') {
          await api.toggleHiddenReply(payload.eventId, {
            reply_id: payload.id,
            hidden: payload.hidden,
          });
        }
        this.onToggleHidden(payload);
      } catch (e) {
        this.onToggleHiddenFailure(payload);
        notification.error({
          message: 'An error occured while changing message visibility.',
        });
      }
    },
  },
  selectors: slice => ({
    allRepliesByDay() {
      return slice(state =>
        Object.values(state)
          .sort()
          .reduce((acc, reply) => {
            const day = reply.received_at.format('MM/DD/YYYY');
            if (!acc[day]) acc[day] = [];
            acc[day].push(reply);
            return acc;
          }, {})
      );
    },
  }),
};
