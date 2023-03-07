function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

export const initialState = {
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
};

export default {
  state: initialState,
  reducers: {
    toggleAll(state, payload) {
      const { width } = payload;
      let { height } = payload;
      const view = getView(width);
      const collapsed = view !== 'DesktopView';
      if (state.view !== view || height !== state.height) {
        if (!height) height = state.height;
        return {
          collapsed,
          view,
          height,
        };
      }
      return state;
    },
  },
};
