import qs from 'query-string';
import axios from './axios';

const login = (email, password) => {
  // Assuming a browser environment
  const hash = qs.parse(window.location.search).invite;
  return axios
    .post(
      `/auth/login${hash && hash.trim().length > 0 ? `?invite=${hash}` : ''}`,
      {
        email,
        password,
      }
    )
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data);
      }

      if (res.response && res.response.status == 401) {
        return Promise.reject(res);
      }

      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    })
    .catch(error => {
      if (error.response) {
        // Server responded
        const res = error.response;
        if (res.status == 401) {
          return Promise.reject(
            new Error('The provided email or password is incorrect.')
          );
        }
        return Promise.reject(new Error(res.data.message));
      }
      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    });
};

const register = (
  firstName,
  lastName,
  phone,
  email,
  password,
  passwordConfirmation,
  userSource,
  typeOfBusiness,
  isProfessional,
  businessname,
  website,
  partnership
) => {
  // Assuming a browser environment
  const hash = qs.parse(window.location.search).invite;
  return axios
    .post(
      `/auth/register${
        hash && hash.trim().length > 0 ? `?invite=${hash}` : ''
      }`,
      {
        firstName,
        lastName,
        phone,
        email,
        password,
        password_confirmation: passwordConfirmation,
        userSource,
        typeOfBusiness,
        isProfessional,
        businessname,
        website,
        partnership,
      }
    )
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data);
      }

      return Promise.reject(
        new Error(
          'Sorry, an error occured while trying to create your account.'
        )
      );
    })
    .catch(error => {
      const res = error.response;
      let errorMessage =
        'Sorry, an error occured while trying to create your account.';

      // Retrieving the error message from the back end
      if (res.data && res.data.errors) {
        const firstError = Object.values(res.data.errors);
        if (firstError && typeof firstError === 'string') {
          errorMessage = firstError;
        } else if (
          firstError &&
          firstError.constructor === Array &&
          firstError.length > 0
        ) {
          errorMessage = firstError[0];
        }
      }
      return Promise.reject(new Error(errorMessage));
    });
};

const logout = () =>
  axios.post('/auth/logout', {}).then(res => {
    if (res.status === 200) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
  });

const me = () =>
  axios.get('auth/me').then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data);
    }
    return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
  });

const impersonate = (userId: string) =>
  axios
    .post('/impersonate', {
      userId,
    })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data);
      }

      if (res.response && res.response.status == 401) {
        return Promise.reject(res);
      }

      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    })
    .catch(error => {
      if (error.response) {
        // Server responded
        const res = error.response;
        if (res.status == 401) {
          return Promise.reject(
            new Error(
              'An error occured while trying to impersonate the requested user.'
            )
          );
        }
        return Promise.reject(new Error(res.data.message));
      }
      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    });

const leaveImpersonation = () =>
  axios
    .get('/leave-impersonation')
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data);
      }

      if (res.response && res.response.status == 401) {
        return Promise.reject(res);
      }

      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    })
    .catch(error => {
      if (error.response) {
        // Server responded
        const res = error.response;
        if (res.status == 401) {
          return Promise.reject(
            new Error(
              'An error occured while trying to impersonate the requested user.'
            )
          );
        }
        return Promise.reject(new Error(res.data.message));
      }
      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    });

const updateBasicInfo = body =>
  axios.post('auth/update-basic-info', body).then(res => {
    if (res.status === 200) {
      return Promise.resolve(res.data.data);
    }
    return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
  });

const updatePassword = (oldPassword, newPassword, newPasswordConfirmation) =>
  axios
    .post('auth/update-password', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    })
    .then(res => {
      if (res.status === 200) {
        if (res.data.status === 'success') return Promise.resolve();
        return Promise.reject(new Error('Could not change password'));
      }
      return Promise.reject(new Error('Request Failed')); // TODO detailed error handling
    });

const sendResetPasswordLink = email =>
  axios.post('auth/send-reset-link', { email }).then(res => {
    if (res.status === 200) {
      if (res.data.status === 'success') {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error('Sorry, we could not retrieve this email.')
      );
    }
    return Promise.reject(
      new Error('Sorry, we could not retrieve this email.')
    );
  });

const recoverPassword = (
  token,
  encryptedEmail,
  newPassword,
  newPasswordConfirmation
) =>
  axios
    .post('auth/recover-password', {
      token,
      encryptedEmail,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    })
    .then(res => {
      if (res.status === 200) {
        if (res.data.status === 'success') return Promise.resolve();
        return Promise.reject(new Error('Could not recover password.'));
      }
      return Promise.reject(new Error('Request failed')); // TODO detailed error handling
    });

const processInvitation = inviteToken =>
  axios
    .post('process-invitation', { invite: inviteToken })
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(
        new Error(
          'An error occured while trying to give you permissions for the event.'
        )
      );
    })
    .catch(error => {
      if (error.response) {
        // Server responded
        const res = error.response;
        if (res.data.message) {
          return Promise.reject(new Error(res.data.message));
        }
      }
      return Promise.reject(
        new Error(
          'An error occured while trying to give you permissions for the event.'
        )
      );
    });

const verifyUser = async (phone, otp) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/auth/verify', { otp, phone })
      .then(response => {
        if (
          response &&
          response.status === 200 &&
          response.data.status_code === 200
        ) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(err => reject(err));
  });
};
const sendOtp = async phone => {
  return new Promise((resolve, reject) => {
    axios
      .post('/auth/sendOTP', { phone })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
  // console.log('response ', response);
};

export default {
  login,
  register,
  logout,
  me,
  impersonate,
  leaveImpersonation,
  updateBasicInfo,
  updatePassword,
  sendResetPasswordLink,
  recoverPassword,
  processInvitation,
  verifyUser,
  sendOtp,
};
