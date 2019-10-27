
/**
 * ListView é dinânico
 * Pode alterar qual componente vai ser montado
 * Altera entre *../../pages/Heroes* *../../pages/Comcis*
 * 
 * Esse componente reage ao estado da aplicação
 * O FlatList junto com Doom guarda props.key
 * 
 */

import React, { useEffect } from 'react';
import { FlatList, Animated } from 'react-native';
import { GLOBAL_CTX, types } from '../../store';

import { Container } from './styles';

import Heroes from '../../pages/Heroes';
import Comics from '../../pages/Comics';
import api from '../../api';
import { createDataRows } from '../../utils';

export default () => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const { environment: { scene }, charactersData, comicsData } = globalState;

  let opacity = new Animated.Value(0);

  const totalComics = 45621;

  useEffect(() => {             // Anima o container, sensação de pagina entrando
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
    }).start();
  }, []);

  useEffect(() => {
    const { environment, comicsData } = globalState;

    if (environment.scene === types.SCENE_COMICS) { // Se nao tiver nenhuma Comic na lista solicita uma faixa entre 0 e totalComics
      if (!comicsData.results.length) {
        if (!environment.filterCharacter) {
          api.getComics({ ...globalState.auth, offset: Math.random() * totalComics }).then(({ data }) => {
            createDataRows({ columns: 2, data: data.results }).then(rows => {
              setGlobalState({ action: types.STORAGE_COMICS, comicsData: { ...data, results: rows } })
            });
          });
        }
      }
    }

  }, [globalState.environment]);

  return (
    <Container style={{
      opacity,
      transform: [{
        translateX: opacity.interpolate({
          inputRange: [0, .5],
          outputRange: [10, 0],
          extrapolate: 'clamp'
        })
      }]
    }}
    >
      <FlatList
        data={scene === types.SCENE_CHARACTERS ? charactersData.results : comicsData.results}
        renderItem={scene === types.SCENE_CHARACTERS ? Heroes : Comics}
        keyExtractor={item => 'ListView' + item[0].id}
        style={{ flex: 1 }}
      />
    </Container>
  );
};