import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { withStore } from 'react-context-hook';
import { ClientList } from './components/ClientList';

import './custom.css'

import Modal from 'react-modal';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class App extends Component {
  // Redirect, so that table isn't re-sorted after detail is opened
  render () {
    return (
      <Layout>
        <Route exact path='/'>
          <Redirect to="/client/list" />
        </Route>
        <Route exact path='/client'>
          <Redirect to="/client/list" />
        </Route>
        <Route path='/client/:clientId' component={ClientList} />
      </Layout>
    );
  }
}

export default withStore(App);
