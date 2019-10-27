import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

import Config from '../../components/config';

export const Container = styled.View`
   width: ${width};
   height: ${Config.comicImgHeight + Config.comicTitle};
   background-color: #222;
   justify-content: space-evenly;
   flex-direction: row;
`;