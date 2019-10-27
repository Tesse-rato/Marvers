import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  headerHeight: height / 6,
  botBarHeight: height / 14,
  heroImgWidth: width / 2.05,
  heroImgHeight: width / 2.05,
  heroNameHeight: 40,
  comicImgWidth: width / 2.05,
  comicImgHeight: width / 1.3,
  comicTitle: 70,
  botButIcoSize: (height / 14) / 1.3,
  botButtonWidth: width / 3.009,
  spaceHeight: height / 1.7,
}