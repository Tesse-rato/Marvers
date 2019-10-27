
/**
 * Esse component apenas dispõem um ambiente para o component Hero
 * Filho duma FlatList ele fornece uma Linha da lista
 * Cada Linha contem um Array de elementos que serao passados para Hero
 * 
 * Esse component recebe um Array Bidimencional
 * Retorna uma Linha renderizada por Hero
 * 
 * O conteiner tem dimensões que vão garantir as dimensões da lista horizontal de Heroes
 */


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
