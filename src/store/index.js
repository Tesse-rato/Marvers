import React from 'react';
import globalReducer from './reducer';
import { types as TYPES } from './reducer';
export const GLOBAL_CTX = React.createContext();
export const types = TYPES;

export default props => {

  const global_state = React.useReducer(globalReducer, {
    auth: '',           // Objeto com todos dados necessarios da autenticação na marvel API
    charactersData: { results: [] }, // Objeto com a resposta da rota /v1/public/characters
    comicsData: { results: [] },     // Obejto com a resposta da rota /v1/public/comics
    comicDetails: { results: [] }, // Obejto com o resultado da solicitacao de comic pelo ID
    environment: '',    // Obejto com as configurações do ambiente e fluxo do HOC Store
  })

  return (
    <GLOBAL_CTX.Provider value={global_state}>
      {props.children}
    </GLOBAL_CTX.Provider>
  );
}