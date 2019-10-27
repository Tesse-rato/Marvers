
/**
 * Esse component é o HOC da Header
 * 
 * Ele faz todas funcoes disignadas ao header
 * 
 * Um input para busca que reage ao ambiente
 * 
 * Uma área de feedBack visual para informar se existe um filtro de personagem para as Comics
 * 
 * Se limpar esse filtro de personagem a lista de comics é limpa e busca por Comics aleatórios
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, ProgressBarAndroid } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  Container,
  Logo,
  TopContainer,
  BotContainer,
  SearchBar,
  Name,                 // Qual nome de personagem esta no filtro
  FilterCharacterClear  // Botao para limpar o filtro de personagem no ambiente
} from './styles';

import MarvelPNG from '../../assets/MarvelComics.png';
import { GLOBAL_CTX } from '../../store';
import { types } from '../../store/reducer';
import api from '../../api';
import { createDataRows } from '../../utils';

export default props => {
  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [filterName, setFilterName] = React.useState(null);     // Nome do Personagem que esta no filtro, quando tem
  const [search, setSearch] = React.useState(null);             // Texto no Input do Header
  const [searching, setSearching] = React.useState(false);      // Está buscando?
  const [oldComics, setOldComics] = React.useState(false);      // Essa variavel auxilia a busca por Comics

  const { environment: { scene, filterCharacter } } = globalState;

  useEffect(() => {
    if (!oldComics.length) {
      setOldComics(globalState.comicsData.results);
    }
  }, [globalState]);

  if (filterCharacter) { // Esse trexo prefisa ser executado em toda montagem, independende de qualquer alteração em estado
    const { name } = filterCharacter;
    if (!filterName || filterName != name) {
      setFilterName(name);
    }
  }

  const handleClearClick = () => { // Limpa qualquer filtro e resultado que ta na aplicção
    setGlobalState({ action: types.SET_ENVIRONMENT, environment: { filterCharacter: '' }, comicsData: { results: [] }, charactersData: { results: [] } })
    setFilterName(null);
  }

  const handleSearchClick = () => { // Controla botao de busca ao lado do Input
    /** 
     * Quando o botao é clicado é mudado um stado para dar feedback que esta sendo buscado
     * Esprando a resposta da API o botao é desmontado
     * O usuário não consegue fazer outra solicitacao enquanto a outra não responder
    */
    if (!search) return;
    setSearching(true);
    api.filterCharacters(search).then(results => {
      createDataRows({ data: results, columns: 2 }).then(rows => {
        setGlobalState({ action: types.STORAGE_CHARACTERS, charactersData: { results: rows } });
        setSearching(false);
      });
    }).catch(err => {
      console.log(err);
      setSearching(false);
    });
  }

  let busy = false; // Essa variável auxilia para não ter mais de uma solicitação ao mesmo tempo para API
  const handleInput = text => {
    /**
     * Essa função reage ao estado do ambiente
     * Quando esta na tela de characteres é realizado uma busca nas comics que já estão em memoria
     * Quando a busca é na scena de personagems é feita uma solicitação no servidor local 
     * O servidor local tem um cache com todos personagem para evitar requisições massivas na Marvel API
     */
    if (!text) {
      if (scene === types.SCENE_CHARACTERS) {
        api.getCharacters(globalState.auth).then(({ data }) => {
          createDataRows({ data: data.results, columns: 2 }).then(rows => {
            setGlobalState({ action: types.STORAGE_CHARACTERS, charactersData: { results: rows } });
          });
        });
      }
      else if (scene === types.SCENE_COMICS) {
        setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: oldComics } });
        // Se não tiver nenhum texto na busca é retornado as Comics que já estao em memória
      }
      setSearch(text);
      return;
    }

    if (scene === types.SCENE_CHARACTERS) {
      setSearch(text);
      // Busca de caracteres é controlada pelo botao de busca
      // esse trecho apenas controla o input e salva o texto no estado
    }
    else if (scene === types.SCENE_COMICS && text && !busy) {
      /**
       * A cada botao clicado quando buscando Comics esse trecho é executado
       * Para evitar muitas chamadas, enquando o laço nao termina é rejeitado novas chamadas
       * Depois do laco percorrer as Comics em memoria, esse novo conteudo é mostrado e o componente é setado como desocupado
       */
      busy = true;
      setSearch(text);
      let result = new Array();
      const regex = new RegExp(text, 'gi');

      oldComics.map(row => {
        row.map(comic => {
          if (regex.test(comic.title)) {
            result.push(comic); // Filtando toda Comic em memória
          }
        });
      });

      if (result.length < 1) {
        // Se não tiver nada no resultado de busca retorna para o estado inical pronto pra receber um novo parametro de busca
        setSearch(null);
        setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: oldComics } });
        return;
      }
      else {
        // Tendo resultado na busca das Comics se cria a tabela de dados para o componente Comics - Comic consiga ser montado
        createDataRows({ data: result, columns: 2 }).then(rows => {
          setGlobalState({ action: types.STORAGE_COMICS, comicsData: { results: rows } });
          setTimeout(() => busy = false, 1000); // Aguarda 1 segundo para aceitar o proximo parametro de busca
          // Esse timeout evita que seja feija uma requisição pra cada letra adicionada a busca
        });
      }
    }
  }

  let placeholder = 'Buscar por ...';     // O placeholder é dinâmico podendo mudar dependendo do ambiente
  if (scene === types.SCENE_CHARACTERS) {
    placeholder = 'Buscar por Personagem';
  }
  else if (scene === types.SCENE_COMICS) {
    placeholder = 'Buscar por esses HQs'
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
      </TopContainer>
      <BotContainer>
        <Name>{filterName ? filterName : "Nenhum Personagem Selecionado"}</Name>
        {filterName && <TouchableOpacity onPress={handleClearClick}><FilterCharacterClear>limpar.</FilterCharacterClear></TouchableOpacity>}
      </BotContainer>
    </Container>
  );
}