import { init } from '@rematch/core';
import selectPlugin from '@rematch/select';
import loadingPlugin from '@rematch/loading';
import * as models from './models';
import { initialState as eventInitialState } from './models/event';
import { initialState as messageInitialState } from './models/message';
import { initialState as replyInitialState } from './models/reply';
import { initialState as groupInitialState } from './models/group';
import { initialState as guestInitialState } from './models/guest';
import { initialState as pushInitialState } from './models/test';
import { initialState as directInitialState } from './models/direct';
const store = init({
  models,
  plugins: [selectPlugin(), loadingPlugin()],
  redux: {
    rootReducers: {
      RESET_USER_STATE: state => ({
        ...state,
        Auth: {},
        Event: eventInitialState,
        Message: messageInitialState,
        Chat: directInitialState,
        Reply: replyInitialState,
        Group: groupInitialState,
        Guest: guestInitialState,
        Test: pushInitialState,
      }),
    },
    devtoolOptions: {
      // eslint-disable-next-line no-undef
      disabled: process.env.NODE_ENV === 'production',
    },
  },
});

export default store;
export const dispatch = store.dispatch;

export { store };
