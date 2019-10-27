import styled from 'styled-components/native';
import { Dimensions, Animated } from 'react-native';
const { width, height } = Dimensions.get('window');

import Config from '../config';

export const Container = styled.View`
  width: ${Config.comicImgWidth};
  height: ${Config.comicImgHeight};
  background-color: #333;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

export const ComicImage = styled.Image.attrs(props => ({ ...props }))`
  width: ${Config.comicImgWidth};
  height: ${Config.comicImgHeight};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

export const TitleContainer = styled.View`
  width: ${Config.comicImgWidth};
  height: ${Config.comicTitle - 2};
  background-color: #FFF;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding-left: 5px;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 14;
  color: #222;
`;

export const Name = styled.Text`
  font-size: 10;
  color: #444;
  top: -10px;
`;

export const Variant = styled.Text`
  font-size: 10;
  color: #777;
  margin-left: 5px;
`;
