import styled from 'styled-components/native';
import { Dimensions, Animated } from 'react-native';
import componentConfig from '../../components/config';
const { width, height } = Dimensions.get('window');

export const Container = styled(Animated.View)`
  width: ${width};
  height: ${height - 20};
  top: 0px;
  left: 0px;
  background-color: #222;
  position: absolute;
`;

export const ComicImage = styled(Animated.Image).attrs(props => ({
  resizeMode: 'cover'
}))`
  width: ${width};
  height: ${height};
  position: absolute;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  left: 5px;
`;

export const Space = styled.View`
  width: ${width};
  height: ${componentConfig.spaceHeight};
`;

export const Title = styled.Text`
  width: ${width - 60};
  color: #FFF;
  font-size: 26px;
  margin-left: 7px;
  font-family: Verdana;
`;

export const Details = styled.Text`
  font-size: 16px;
  color: #FFF;
  margin-left: 15px;
  margin-right: 10px;
`;

export const HeroPreview = styled.View`
  margin: 5px;
  margin-bottom: 10px;
  height: ${componentConfig.heroImgHeight + componentConfig.heroNameHeight};
`;

export const SaleDate = styled.Text`
  width: 200px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 50px;
  background-color: #FFF;
  color: #222;
  text-align: center;
  margin-left: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const Creators = styled.View`
  width: ${width - 20};
  padding: 20px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-radius: 10px;
  background-color: rgba(255,255,255, .1);
  align-self: center;
  margin-bottom: 20px;
`;

export const Creator = styled.Text`
  font-size: 14px;
  color: #FFF;
  font-family: monospace;
  margin: 7px;
  font-style: italic;
`;

export const ComicImagePreview = styled.Image`
  width: ${componentConfig.comicImgWidth};
  height: ${componentConfig.comicImgHeight};
  margin-bottom: 20px;
`;

export const Price = styled.Text`
  color: #FFF;
  font-size: 10px;
  margin-left: 4px;
  margin-top: 2px;
  border-left-color: #FFF;
  border-left-width: 2px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 1px;
  top: 25px;
`;

export const CopyRight = styled.Text`
  width: ${width};
  font-size: 8px;
  color: #FFF;
  text-align: center;
  align-self: center;
  margin-bottom: 30px;
  border-top-width: .5px;
  border-top-color: #FFF;
  padding-top: 60px;
`;