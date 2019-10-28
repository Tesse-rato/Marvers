import React from 'react';
import { StatusBar } from 'react-native';
import Main from './components/Main';

import Store from './store';

export default () => (
  <Store>
    <StatusBar barStyle='light-content' backgroundColor='#222' />
    <Main />
  </Store>
);