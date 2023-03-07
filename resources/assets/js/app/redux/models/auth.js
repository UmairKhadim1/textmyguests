import api from '../../services/api';
import notification from '../../components/feedback/notification';

export const storeTokenInLocalStorage = (token: string, ttl: number) => {
  // Current timestamp in seconds.
  const currentTimestamp = Math.floor(Date.now() / 1000);

  localStorage.setItem('token', token);
  localStorage.setItem('token_expires_at', currentTimestamp + ttl);
};

export const getTokenFromLocalStorage = () => {
  // Current timestamp in seconds.
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Check if token is expired
  const tokenExpiresAt = localStorage.getItem('token_expires_at');
  if (tokenExpiresAt && parseInt(tokenExpiresAt) > currentTimestamp) {
    return localStorage.getItem('token');
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_at');
    return null;
  }
};

export const initialState = {
  token: getTokenFromLocalStorage(),
  user: {},
  reset: {},
};

export default {
  state: initialState,
  reducers: {
    onLogin(state, token, user) {
      return {
        ...state,
        token,
        user,
      };
    },
    onImpersonate(state, token) {
      return {
        ...state,
        token,
      };
    },
    onLogout() {
      return {};
    },
    onLoadUser(state, user) {
      return {
        ...state,
        user,
      };
    },
    onUpdateUser({ token, user }, { firstName, lastName, email }) {
      return {
        token,
        user: {
          ...user,
          firstName,
          lastName,
          email,
        },
      };
    },
    onSendResetPasswordLink(state, { success, email }) {
      return {
        ...state,
        reset: { success, email },
      };
    },
    onRecoverPassword(state) {
      return {
        ...state,
        passwordRecovered: true,
      };
    },
    storeInviteToken(state, token) {
      return {
        ...state,
        inviteToken: token,
      };
    },
    onProcessInvitation(state) {
      return {
        ...state,
        inviteToken: null,
      };
    },
    onVerficationUser(state, user) {
      return {
        ...state,
        user,
      };
    },
  },
  effects: {
    async login(payload) {
      const { email, password, cb } = payload;
      try {
        const response = await api.login(email, password);
        const token = response.data.access_token;
        const tokenTtl = response.data.expires_in; // TTL = Time to live (in seconds)
        const user = response.data.user;
        this.onLogin(token, user);
        storeTokenInLocalStorage(token, tokenTtl);

        if (cb) cb();
      } catch (e) {
        notification.error({
          message: e.message,
        });
      }
    },
    async register(payload) {
      const { user, cb } = payload;
      const {
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
        partnership,
      } = user;
      try {
        const response = await api.register(
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
        );

        const token = response.data.access_token;
        const tokenTtl = response.data.expires_in; // TTL = Time to live (in seconds)
        this.onLogin(token);
        storeTokenInLocalStorage(token, tokenTtl);

        if (cb) cb();
      } catch (e) {
        notification.error({
          message: e.message,
        });
      }
    },
    async logout({ cb } = {}) {
      try {
        await api.logout();

        localStorage.removeItem('token');
        localStorage.removeItem('token_expires_at');
        this.onLogout();

        if (cb) cb();
      } catch (e) {
        notification.error({
          message:
            'A problem occured while logging you out. Please refresh the page to make sure you are logged out.',
        });
      }
    },
    async me() {
      try {
        const user = await api.me();
        this.onLoadUser(user);
        console.log('user data', user);
        return user;
      } catch (e) {
        notification.error({
          message: 'Error loading your info',
        });
      }
    },
    async impersonate(payload) {
      const { userId, cb } = payload;
      try {
        const response = await api.impersonate(userId);
        const token = response.data.access_token;
        const tokenTtl = response.data.expires_in; // TTL = Time to live (in seconds)
        this.onImpersonate(token);
        storeTokenInLocalStorage(token, tokenTtl);

        if (cb) {
          cb();
        }
      } catch (e) {
        notification.error({
          message: e.message,
        });
      }
    },
    async leaveImpersonation() {
      try {
        const response = await api.leaveImpersonation();
        const token = response.data.access_token;
        const tokenTtl = response.data.expires_in; // TTL = Time to live (in seconds)
        storeTokenInLocalStorage(token, tokenTtl);

        // Reload the app
        location.reload();
      } catch (e) {
        notification.error({
          message: e.message,
        });
      }
    },
    async updateBasicInfo(user) {
      try {
        const savedUser = await api.updateBasicInfo(user);
        this.onUpdateUser(savedUser);
        notification.success({
          message: 'Account info updated',
        });
      } catch (e) {
        notification.error({
          message: 'Account info not changed',
        });
      }
    },
    async updatePassword({
      oldPassword,
      newPassword,
      newPasswordConfirmation,
    }) {
      try {
        await api.updatePassword(
          oldPassword,
          newPassword,
          newPasswordConfirmation
        );
        notification.success({
          message: 'Password changed',
        });
      } catch (e) {
        notification.error({
          message: 'Failed changing password',
        });
      }
    },
    async sendResetPasswordLink(email) {
      try {
        await api.sendResetPasswordLink(email);
        this.onSendResetPasswordLink({ success: true, email });
      } catch (e) {
        notification.error({
          message: 'Sorry, we could not retrieve this email address.',
        });
      }
    },
    async recoverPassword({
      token,
      encryptedEmail,
      newPassword,
      newPasswordConfirmation,
    }) {
      try {
        await api.recoverPassword(
          token,
          encryptedEmail,
          newPassword,
          newPasswordConfirmation
        );
        this.onRecoverPassword();
      } catch (e) {
        notification.error({
          message:
            'Sorry, an error occurred and we could not reset your password.',
        });
      }
    },
    async processInvitation(inviteToken) {
      try {
        await api.processInvitation(inviteToken).then(e => {
          if (e.isPlanner) {
            notification.success({
              message: 'You have succesfully joined the event as a planner',
            });
          } else {
            notification.success({
              message: 'You have succesfully joined the event as a host',
            });
          }
        });
        this.onProcessInvitation();
      } catch (e) {
        let message =
          'Sorry, an error occured while trying to give you permissions for the event.';
        if (e && e.message) {
          message = e.message;
        }
        notification.error({ message });
      }
    },
    async UserVerificationOtp({ phone, otp }) {
      try {
        console.log('user verificatio otp', otp, phone);
        let response = await api.verifyUser(phone, otp);
        notification.success({
          message: 'Your phone number is verified',
        });
        return true;
      } catch (e) {
        notification.error({
          message: 'Invalid OTP or OTP has been expired',
        });
        return false;
      }
    },
    async SendOtp({ phone }) {
      console.log(phone);
      try {
        const response = await api.sendOtp(phone);
        if (response.status === 200) {
          notification.success({
            message: 'Otp has sent to your phone number',
          });
        }
        return true;
      } catch (err) {
        notification.error({
          message: 'Please re-enter your mobile phone',
        });
      }
      // console.log(response);
    },
  },
  selectors: slice => ({
    token() {
      return slice(auth => auth.token);
    },
    user() {
      return slice(({ user }) => user);
    },
    inviteToken() {
      return slice(auth => auth.inviteToken);
    },
    isImpersonating() {
      return slice(auth => (auth.user ? auth.user.impersonated : false));
    },
  }),
};
