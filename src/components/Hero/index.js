import React from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';

import { GLOBAL_CTX, types } from '../../store';

import {
  Container,
  HeroImage,
  HeroName,
  TitleContainer,
  Text,
  HeroDetails,
} from './styles';
import api from '../../api';
import { createDataRows } from '../../utils';

export default ({ thumbnail, name, id, description }) => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const { auth: { accessParams } } = globalState;

  const opacity = new Animated.Value(0);

  let detailsOpen = false;

  const handleDetailsClick = () => {
    let value = detailsOpen ? 0 : 2;
    detailsOpen = !detailsOpen;
    Animated.timing(opacity, { toValue: value, duration: 300 }).start();
  };

  const handleCharacterClick = () => {

    let environment = { scene: types.SCENE_COMICS, filterCharacter: { id, name } };

    setGlobalState({ action: types.SET_ENVIRONMENT, comicsData: { results: [] }, environment });

    api.getHeroesComics({ id, ...globalState.auth }).then(({ data }) => {
      createDataRows({ data: data.results, columns: 2 }).then(rows => {
        setGlobalState({
          action: types.STORAGE_COMIC_HEROES,
          comicsData: { ...data, results: rows },
          environment
        });
      }).catch(err => {
        throw new Error(err);
      });
    });
  }

  const interpolate = (value, inputRange, outputRange) => {
    return value.interpolate({ inputRange, outputRange, extrapolate: 'clamp' });
  }

  return (
    <Container>
      <HeroImage
        style={{ position: 'absolute', opacity: interpolate(opacity, [0, 1], [0, .6]) }}
        source={{ uri: thumbnail.path + '.' + thumbnail.extension + accessParams }}
        blurRadius={4}
      />

      <HeroImage
        style={{ opacity: interpolate(opacity, [0, 1], [1, 0]) }}
        source={{ uri: thumbnail.path + '.' + thumbnail.extension + accessParams }}
      />

      <HeroDetails style={{ opacity: interpolate(opacity, [0, 1, 2], [0, 0, 1]) }}>
        {description ? description : 'Sem Detalhes'}
      </HeroDetails>

      <TitleContainer>
        <HeroName>{name}</HeroName>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
          <TouchableOpacity onPress={handleDetailsClick}>
            <Text>Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCharacterClick}>
            <Text>Comics</Text>
          </TouchableOpacity>
        </View>
      </TitleContainer>
    </Container>
  );
};