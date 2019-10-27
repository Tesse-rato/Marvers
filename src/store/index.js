
/**
 * Essa Store é um HOC da aplicação
 * 
 * Com poucas telas foi possivél usar essa abordagem com apenas 1 Store
 * 
 * Com aplicações maiores e mais components responveis por certos setores
 * é possivel criar mais Stores abaixo na arvore da Dom
 * 
 * Importa e Exporta os types que estao no documento reducer
 * facilita na hora de intender de onde esses types estao sendo importado
 * fica mais autoexplicativo
 */

import React from 'react';
import globalReducer from './reducer';
import { types as TYPES } from './reducer';
export const GLOBAL_CTX = React.createContext();
export const types = TYPES;

export default props => {

  const global_state = React.useReducer(globalReducer, {
    auth: '',                         // Objeto com todos dados necessarios da autenticação na marvel API
    environment: '',                  // Obejto com as configurações do ambiente e fluxo do HOC Store
    charactersData: { results: [] },  // Objeto com a resposta da rota /v1/public/characters
    comicDetails: { results: [] },    // Obejto com o resultado da solicitacao de comic pelo ID
    comicsData: { results: [] },      // Obejto com a resposta da rota /v1/public/comics
  });

  return (
    <GLOBAL_CTX.Provider value={global_state}>
      {props.children}
    </GLOBAL_CTX.Provider>
  );
}