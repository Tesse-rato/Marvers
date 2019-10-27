import React from 'react';
import { StatusBar } from 'react-native';
import Main from './components/Main';

import Store from './store';

export default () => (
  <Store>
    <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
    <Main />
  </Store>
);