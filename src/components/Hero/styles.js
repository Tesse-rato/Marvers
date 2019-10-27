import styled from 'styled-components/native';
import { Dimensions, Animated } from 'react-native';
const { width, height } = Dimensions.get('window');

import Config from '../config';

export const Container = styled.View`
   width: ${Config.heroImgWidth};
   height: ${Config.heroImgHeight};
`;

export const HeroImage = styled(Animated.Image).attrs(({ blurRadius }) => ({
  blurRadius,
}))`
   width: ${Config.heroImgWidth};
   height: ${Config.heroImgHeight};
   border-top-left-radius: 5px;
   border-top-right-radius: 5px;
`;

export const HeroDetails = styled(Animated.Text)`
  font-size: 12px;
  font-family: Verdana;
  position: absolute;
  top: 0px;
  left: 0px;
  color: #FFF;
  padding: 10px;
`;

export const TitleContainer = styled.View`
  width: ${Config.heroImgWidth};
  height: ${Config.heroNameHeight - 2};
  background: #FFF;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 2px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

`;

export const HeroName = styled.Text`
  font-family: sans-serif;
  font-size: 12px;
  color: #333;
`;

export const Text = styled.Text`
  font-family: Verdana;
  color: #0047ab;
  font-size: 10px;
  align-self: flex-end;
`;