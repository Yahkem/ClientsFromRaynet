import React from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { withStore, useStore } from 'react-context-hook';
import { ClientList } from './components/ClientList';

import './custom.css'

import Modal from 'react-modal';
import { Login } from './components/Login';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

function App(){
  const [isLoggedIn] = useStore('isLoggedIn');

  // Redirect, so that table isn't re-sorted after detail is opened
  return (
    <Layout>
      <Route exact path='/'>
        <Redirect to={isLoggedIn ? "/client/list" : "/login" } />
      </Route>
      <Route exact path='/client'>
        <Redirect to={isLoggedIn ? "/client/list" : "/login"} />
      </Route>
      <Route path='/client/:clientId' component={ClientList}>
        {!isLoggedIn && <Redirect to="/login" />}
      </Route>
      <Route exact path='/login' component={Login}>
        {isLoggedIn && <Redirect to="/client/list" />}
      </Route>
    </Layout>
  );
}

export default withStore(App);
