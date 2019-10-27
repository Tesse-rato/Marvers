import React from 'react';
import { View, Text } from 'react-native';

import { Container } from './styles';
import Comic from '../../components/Comic';


export default ({ item, index }) => {
  return (
    <Container>
      {item.map((comic, index) => (
        <Comic {...comic} key={'Comic-' + index + comic.id} />
      ))}
    </Container>
  )
};