import React from 'react';
import { View, ProgressBarAndroid } from 'react-native';
import config from '../config';

export default props => (
  <ProgressBarAndroid
    style={{
      position: 'absolute',
      alignSelf: 'center',
      top: config.headerHeight + 100,
    }}
    styleAttr='Large'
    indeterminate
  />
);

