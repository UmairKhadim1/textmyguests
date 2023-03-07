import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import store from './redux/store';
import PublicRoutes from './router';
import themes from './config/themes';
import AppHolder from './appStyle';
import { hot } from 'react-hot-loader/root';

const App = () => (
  <ThemeProvider theme={themes.themedefault}>
    <AppHolder>
      <Provider store={store}>
        <PublicRoutes />
      </Provider>
    </AppHolder>
  </ThemeProvider>
);

export default hot(App);
