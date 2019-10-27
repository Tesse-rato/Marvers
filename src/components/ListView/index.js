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

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
    }).start();
  }, []);

  useEffect(() => {
    const { environment, comicsData } = globalState;

    if (environment.scene === types.SCENE_COMICS) {
      if (!comicsData.results.length) {
        console.log('Pegando comics automatico');
        if (!environment.filterCharacter) {
          api.getComics({ ...globalState.auth, offset: Math.random() * 45000 }).then(({ data }) => {
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
        keyExtractor={item => item[0].id.toString()}
        style={{ flex: 1 }}
      />
    </Container>
  );
};