// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import SignIn from './containers/Pages/signin';
import SignUp from './containers/Pages/signup';
import ForgotPassword from './containers/Pages/forgotPassword';
import RecoverPassword from './containers/Pages/recoverPassword';
import FourZeroFour from './containers/Pages/404';
import App from './containers/App/App';
import Impersonate from './containers/App/Impersonate';
import qs from 'query-string';
import Partnership from './containers/Pages/Partnership';
import LoadingSpin from './containers/Pages/LoadingSpin';
import { rest } from 'lodash';

const RestrictedRoute = ({
  component: Component,
  isLoggedIn,
  storeInviteToken,
  ...rest
}) => {
  const { location } = rest;
  if (storeInviteToken && location && location.search) {
    const inviteToken = qs.parse(location.search).invite;
    if (inviteToken) {
      storeInviteToken(inviteToken);
    }
  }

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

const GuestRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? <Redirect to="/dashboard" /> : <Component {...props} />
    }
  />
);
const PublicRoutes = ({
  isLoggedIn,
  storeInviteToken,
}: {
  isLoggedIn: boolean,
  storeInviteToken: (token: string) => void,
  impersonate: (userId: string) => void,
}) => {
  return (
    <BrowserRouter basename="/app">
      <Switch>
        <GuestRoute
          path="/signin"
          exact
          component={SignIn}
          isLoggedIn={isLoggedIn}
        />
        <GuestRoute
          path="/signup"
          exact
          component={SignUp}
          isLoggedIn={isLoggedIn}
        />
        <GuestRoute path="/partnership" exact component={Partnership} />
        <GuestRoute
          path="/forgot-password"
          exact
          component={ForgotPassword}
          isLoggedIn={isLoggedIn}
        />
        <GuestRoute
          path="/recover-password/:token/:encryptedEmail"
          exact
          component={RecoverPassword}
          isLoggedIn={isLoggedIn}
        />
        <RestrictedRoute
          path="/impersonate/:id"
          component={Impersonate}
          isLoggedIn={isLoggedIn}
        />
        <RestrictedRoute
          path="/dashboard"
          component={App}
          isLoggedIn={isLoggedIn}
          storeInviteToken={storeInviteToken}
        />
        <Route component={FourZeroFour} />
      </Switch>
    </BrowserRouter>
  );
};
export default connect(
  state => ({
    isLoggedIn: !!store.select.Auth.token(state), // Can return the token, null or undefined
  }),
  ({ Auth: { storeInviteToken } }) => ({
    storeInviteToken,
  })
)(PublicRoutes);
