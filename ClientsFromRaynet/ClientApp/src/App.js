import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { withStore } from 'react-context-hook';
import { ClientList } from './components/ClientList';

import './custom.css'

import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={ClientList} />
        <Route exact path='/client' component={ClientList} />
        <Route path='/client/:clientId' component={ClientList} />
      </Layout>
    );
  }
}

export default withStore(App);
