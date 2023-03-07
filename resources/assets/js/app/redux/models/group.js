import { notification } from 'antd';
import api from '../../services/api';

export const initialState = {};

export default {
  state: initialState,
  reducers: {
    onLoadGroups(state, groups = []) {
      return groups.reduce((map, group) => {
        map[group.id] = group;
        return map;
      }, {});
    },
    onLoadGroup(state, group) {
      if (group && group.id) {
        return {
          ...state,
          [group.id]: group,
        };
      }
      return state;
    },
    onDeleteGroup(state, groupId) {
      const newState = { ...state };
      delete newState[groupId];
      return newState;
    },
    'Event/selectEvent': () => ({}), // Clear
  },
  effects: {
    async loadGroups(eventId) {
      try {
        const { groups } = await api.getEventGroups(eventId);
        this.onLoadGroups(groups);
      } catch (e) {
        notification.error({
          message: 'Error loading groups',
        });
      }
    },
    async loadGroup(payload) {
      try {
        const { eventId, groupId } = payload;
        const { group } = await api.getEventGroup(eventId, groupId);
        this.onLoadGroup(group);
      } catch (e) {
        notification.error({ message: 'Error Loading Group' });
      }
    },
    async saveGroup(payload) {
      const { eventId, group, cb } = payload;
      try {
        const data = await api.saveEventGroup(eventId, group);
        let message = 'Group saved';
        if (!group.id) {
          // New group, go to dashboard
          message = 'Group created';
        }
        notification.success({ message });
        this.onLoadGroup(data.group);
        if (cb) cb();
      } catch (e) {
        let message = 'Error Saving Group';
        if (!group.id) message = 'Error Creating Group';
        notification.error({ message });
      }
    },
    async deleteGroup(payload) {
      const { eventId, groupId, cb } = payload;
      try {
        await api.deleteGroup(eventId, groupId);
        this.onDeleteGroup(groupId);
        notification.success({ message: 'Group deleted' });
        if (cb) cb();
      } catch (e) {
        notification.error({ message: 'Error deleting group' });
      }
    },
  },
  selectors: (slice, createSelector) => ({
    allGroups() {
      return slice(groups => Object.values(groups));
    },
    groupById() {
      return createSelector(
        slice,
        (state, groupId) => groupId.toString(),
        (groups, groupId) => groups[groupId]
      );
    },
  }),
};
