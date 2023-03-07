// @flow
import axios from 'axios';
import { dispatch } from '../../redux/store';

// appUrl is a global variable. See resources/views/index.blade.php
export const BASE_URL = `${window.appUrl}/api`;

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // We getting it everytime
  /* eslint-disable no-param-reassign */
  config.headers = {
    Authorization: `Bearer ${token}`,
    'X-CSRF-TOKEN': window.csrfToken,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      (!error.response.config ||
        error.response.config.url !== BASE_URL + '/auth/login')
    ) {
      // Unauthorized
      dispatch.Auth.onLogout();
      dispatch({ type: 'RESET_USER_STATE' });
    }
    return Promise.reject(error);
  }
);

export default instance;
