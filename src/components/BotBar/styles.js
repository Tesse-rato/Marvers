import styled from 'styled-components/native';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

import Config from '../config';

export const Container = styled(Animated.View)`
   position: absolute;
   width: ${width};
   height: ${Config.botBarHeight};
   bottom: 0px;
   left: 0px;
   right: 0px;
   background-color: #222;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`;

export const BotButtom = styled.TouchableOpacity`
  height: ${Config.botBarHeight};
  width: ${Config.botButtonWidth};
  background-color: #333;
  justify-content: center;
  align-items: center;
`;

export const Line = styled(Animated.View)`
  position: absolute;
  width: ${Config.botButtonWidth};
  height: 2px;
  background-color: red;
  bottom: 0px;
`;