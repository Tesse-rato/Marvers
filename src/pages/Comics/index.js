
/**
 * Como a Page Heroes  leia *../Heroes*
 * 
 * Esse Component fornece um ambiente para ser montada uma lista horizontal
 * Filho do mesmo component FlatList que Heroes é. Veja *../../components/ListView*
 * 
 * Como Heroes recebe um Array Bidimensinal
 * Contém um Container que garante dimensões para a lista de Comics
 */

import React from 'react';
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