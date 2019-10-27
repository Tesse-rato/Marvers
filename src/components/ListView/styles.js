import styled from 'styled-components/native';
import { Animated } from 'react-native';

import Config from '../config';

export const Container = styled(Animated.View)`
   margin-top: ${Config.headerHeight};
   margin-bottom: ${Config.botBarHeight};
   flex: 20;
   background-color: #222;
   justify-content: flex-end;
   padding-top: 5px;
`;