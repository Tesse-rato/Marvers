import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

import ComponentsConfig from '../../components/config'

export const Container = styled.View`
  width: ${width};
  height: ${ComponentsConfig.heroImgHeight + ComponentsConfig.heroNameHeight};
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
`;
