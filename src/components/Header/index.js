import React, { useEffect } from 'react';
import { TouchableOpacity, ProgressBarAndroid } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  Container,
  Logo,
  TopContainer,
  BotContainer,
  SearchBar,
  Name,
  FilterCharacterClear
} from './styles';

import MarvelPNG from '../../assets/MarvelComics.png';
import { GLOBAL_CTX } from '../../store';
import { types } from '../../store/reducer';
import api from '../../api';
import { createDataRows } from '../../utils';

export default props => {
  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [filterName, setFilterName] = React.useState(null);
  const [search, setSearch] = React.useState(null);
  const [searching, setSearching] = React.useState(false);
  const [oldComics, setOldComics] = React.useState(false);

  const { environment: { scene, filterCharacter } } = globalState;
  let placeholder = 'Buscar por ...';

  useEffect(() => {
    if (!oldComics.length) {
      setOldComics(globalState.comicsData.results);
    }
  }, [globalState]);

  if (filterCharacter) {
    const { environment: { filterCharacter: { name } } } = globalState
    if (!filterName || filterName != name) {
      setFilterName(name);
    }
  }

  const handleClearClick = () => {
    setGlobalState({ action: types.SET_ENVIRONMENT, environment: { filterCharacter: '' }, comicsData: { results: [] }, charactersData: { results: [] } })
    setFilterName(null);
  }

  if (scene === types.SCENE_CHARACTERS) {
    placeholder = 'Buscar por Personagem';
  }
  else if (scene === types.SCENE_COMICS) {
    placeholder = 'Buscar por esses HQs'
  }

  const handleSearchClick = () => {
    setSearching(true);
    api.filterCharacters(search).then(results => {
      createDataRows({ data: results, columns: 2 }).then(rows => {
        setGlobalState({ action: types.STORAGE_CHARACTERS, charactersData: { results: rows } });
        setSearching(false);
      });
    });
  }

  let busy = false;
  const handleInput = text => {
    if (scene === types.SCENE_CHARACTERS) {
      setSearch(text);
    }
    else if (scene === types.SCENE_COMICS && text && !busy) {
      setSearch(text);
      busy = true;

      const regex = new RegExp(text, 'gi');

      let comics = oldComics;
      let result = [];

      comics.map(row => {
        row.map(comic => {
          if (regex.test(comic.title)) {
            result.push(comic);
          }
        });
      });

      if (result.length < 1) {
        setSearch(null);
        setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: oldComics } });
        return;
      }
      else {
        createDataRows({ data: result, columns: 2 }).then(rows => {
          setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: rows } });
          setTimeout(() => busy = false, 1000);
        });
      }
    }
    else if (!text) {
      setSearch(text);
      setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: oldComics } });
    }
  }

  return (
    <Container>
      <TopContainer>
        <Logo source={MarvelPNG} />
        <SearchBar placeholder={placeholder} onChangeText={handleInput} value={search} />
        {!searching ? scene === types.SCENE_CHARACTERS ? (<TouchableOpacity onPress={handleSearchClick}>
          <Entypo name='magnifying-glass' size={25} color="#555" style={{ marginLeft: 15, marginTop: 25 }} />
        </TouchableOpacity>) : null : (
            <ProgressBarAndroid indeterminate styleAttr='Small' style={{ position: 'absolute', top: 25, right: 10 }} />
          )}
        {/* <TouchableOpacity>
          <AntDesign name='filter' size={25} color="#555" style={{ marginLeft: 10, marginTop: 20 }} />
        </TouchableOpacity> */}
      </TopContainer>
      <BotContainer>
        <Name>{filterName ? filterName : "Nenhum Personagem Selecionado"}</Name>
        {filterName && <TouchableOpacity onPress={handleClearClick}><FilterCharacterClear>limpar.</FilterCharacterClear></TouchableOpacity>}
      </BotContainer>
    </Container>
  );
}