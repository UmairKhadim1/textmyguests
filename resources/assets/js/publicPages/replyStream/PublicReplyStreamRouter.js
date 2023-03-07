// @flow
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FourZeroFour from '../404';
import PublicStream from './PublicStream';
import IsolatedReply from './IsolatedReply';

const PublicReplyStreamRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:id" exact component={PublicStream} />
      <Route path="/:id/r/:replyId/:mediaId?" exact component={IsolatedReply} />
      <Route path="/:id/m/:messageId" exact component={IsolatedReply} />
      <Route component={FourZeroFour} />
    </Switch>
  </BrowserRouter>
);

export default PublicReplyStreamRoutes;
