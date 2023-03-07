// @flow
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FourZeroFour from './404';
import PublicReplyStream from './replyStream/PublicReplyStream';
import SelfJoin from './selfJoin/SelfJoin';

const PublicRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:id/join" exact component={SelfJoin} />
      <Route path="/:id" component={PublicReplyStream} />
      <Route component={FourZeroFour} />
    </Switch>
  </BrowserRouter>
);

export default PublicRoutes;
