import React from 'react';
import { View, Text, Animated, Dimensions, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { Container, BotButtom, Line } from './styles';
import { GLOBAL_CTX, types } from '../../store';
import Config from '../config';

const { width, height } = Dimensions.get('window');
const { botButIcoSize, botButtonWidth } = Config;

export default props => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [linePos, setLinePos] = React.useState(0)

  const translateX = new Animated.Value(linePos);

  const screens = [
    types.SCENE_CHARACTERS,
    types.SCENE_COMICS,
    types.SCENE_CHARACTERS,
  ]

  React.useEffect(() => {
    const { environment: { scene } } = globalState;
    switch (scene) {
      case types.SCENE_CHARACTERS: {
        animLine(0);
        break;
      }
      case types.SCENE_COMICS: {
        animLine(1);
        break;
      }
      case types.SCENE_BOUGHT: {
        animLine(3);
        break;
      }
      default: {
        return;
      }
    }

  }, [globalState.environment]);

  const animLine = (value, cb) => {
    Animated.timing(translateX, {
      toValue: value,
      duration: 200,
      easing: Easing.elastic(1)
    }).start(() => {
      if (cb) cb();
      setLinePos(value);
    });
  }

  const setEnvironment = value => {
    setTimeout(() => {
      setGlobalState({ action: types.SET_ENVIRONMENT, environment: { scene: screens[value] } });
      setLinePos(value);
    }, 500);
  }

  return (
    <Container>
      <BotButtom onPress={() => { animLine(0, () => setEnvironment(0)) }} >
        <Ionicons color='#555' name='ios-body' size={botButIcoSize} />
      </BotButtom>
      <BotButtom onPress={() => { animLine(1, () => setEnvironment(1)) }} >
        <Entypo color='#555' name='open-book' size={botButIcoSize} />
      </BotButtom>
      <BotButtom onPress={() => { animLine(2, () => setEnvironment(2)) }} >
        <Fontisto color='#555' name='favorite' size={botButIcoSize} />
      </BotButtom>

      <Line
        style={{
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, (width / 2) - botButtonWidth / 2, width - botButtonWidth],
              })
            },
            { scaleX: .5 }
          ]
        }}
      />

    </Container>
  )
};