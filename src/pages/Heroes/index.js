import React from 'react';
import { Container } from './styles';

import Hero from '../../components/Hero';

export default ({ item, index }) => (
  <Container>
    {item.map(item => (
      <Hero
        {...item}
        key={'row-' + index + '-' + item.id}
      />
    ))}
  </Container>
);
