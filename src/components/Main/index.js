import React, { useEffect } from 'react';
import { View } from 'react-native';

import { GLOBAL_CTX, types } from '../../store';
import MainReducer from './reducer';
import api from '../../api';

import Header from '../Header';
import ListView from '../ListView';
import BotBar from '../BotBar';
import Loading from '../Loading';
import Details from '../../pages/Details';

import { createDataRows } from '../../utils';

export default function Main() {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [state, setState] = React.useReducer(MainReducer, null);

  const [loading, setLoading] = React.useState(true);
  const [showList, setShowList] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const { charactersData, comicsData, environment: { scene, } } = globalState;

  const setCharacters = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      api.getCharacters(state.auth).then(({ data }) => {
        createDataRows({ data: data.results, columns: 2 }).then(rows => {
          setGlobalState({ action: types.STORAGE_AUTH_CHARACTERS, charactersData: { ...data, results: rows }, auth: state.auth });
          setLoading(false);
          resolve();
        });
      }).catch(reject);
    });
  }

  useEffect(() => {
    // Esse effect pega o Token de authenticação da conta de desenvolvedor da marvel no servidor da aplicação
    api.getMarvelToken().then(({ apikey, token, baseURL, ts }) => {
      setState({ action: types.STORAGE_AUTH, auth: { apikey, token, baseURL, ts } });
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    if (!charactersData.results.length) { setCharacters().catch(console.log); return; }
    if (!showList) setShowList(true);

    if (scene === types.SCENE_COMICS) {
      if (comicsData.results.length) {
        setLoading(false);
      }
      else {
        setLoading(true);
      }
    }

    if (scene != types.SCENE_DETAILS) {
      if (showDetails) setShowDetails(false);
    }
    else {
      if (!showDetails) setShowDetails(true);
    }

  }, [globalState, state]);

  return (
    <View style={{ flex: 1, backgroundColor: '#222' }}>
      <Header />
      {showList && <ListView />}
      {loading && <Loading />}
      <BotBar />
      {showDetails && <Details />}
    </View>
  );
}
