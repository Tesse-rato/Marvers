import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

import Config from '../config';

export const Container = styled.View`
  width: ${width};
  height: ${Config.headerHeight};
  background-color: blue;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;
export const TopContainer = styled.View`
  flex: 1;
  background-color: #222;
  flex-direction: row;
`;
export const BotContainer = styled.View`
  flex: .6;
  background-color: #222;
  padding-left: 13px;
  flex-direction: row;
`;

export const Logo = styled.Image`
  width: 60px;
  height: 43px;
  margin-top: 10px;
  margin-left: 10px;
`;

export const SearchBar = styled.TextInput.attrs((props) => ({
  placeholder: props.placeholder,
  placeholderTextColor: '#555',
  onChangeText: props.onChangeText
}))`
  margin-top: 15px;
  margin-left: 10px;
  padding: 3px;
  padding-left: 10px;
  border-radius: 50px;
  width: ${width / 1.8};
  height: 40px;
  background-color: #333;
  font-family: 'SansSerif';
  color: #555;
`;

export const Name = styled.Text`
  color: #777;
  font-size: 14px;
  margin-top: 9px;
`;

export const FilterCharacterClear = styled.Text`
  color: #0047ab;
  font-size: 12px;
  font-style: italic;
  margin-top: 11px;
  margin-left: 5px;
  font-family: Verdana;
`;