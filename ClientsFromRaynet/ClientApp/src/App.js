import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { withStore } from 'react-context-hook';
import { ClientList } from './components/ClientList';

import './custom.css'

class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={ClientList} />
      </Layout>
    );
  }
}

export default withStore(App);
