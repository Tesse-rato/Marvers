import NewApi, { client as Client } from './newApi';
let localhost = 'http://caserahost.ddns.net:3030';

const routes = [
  {
    name: 'getCharacters',
    path: '/v1/public/characters',
    method: 'GET'
  },
  {
    name: 'getComics',
    path: '/v1/public/comics',
    method: 'GET'
  },
  {
    name: 'getHeroesComics',
    path: '/v1/public/characters/id/comics',
    method: 'GET'
  },
  {
    name: 'getComicsDetails',
    path: '/v1/public/comics/id',
    method: 'GET'
  },
  {
    name: 'getCharacerDetails',
    path: '/v1/public/comics/id',
    method: 'GET'
  },
]

/**
 * Algumas funções nao seguem o padrão das rqeuisicoes da marvel
 * Essas foram adicionadas manualmente
 */
let newApi = NewApi(routes); // A nova API monta as funcoes dinâmicamente
const api = {
  ...newApi,
  getMarvelToken() {
    return new Promise((resolve, reject) => {
      client({ url: `${localhost}/auth` }).then(({ apikey, token, baseURL, ts }) => {
        resolve({ apikey, token, baseURL, ts });
      }).catch(reject)
    });
  },
  filterCharacters(search) {
    return new Promise((resolve, reject) => {
      client({ url: `${localhost}/characters/search/${search}` }).then(({ results }) => {
        resolve(results);
      }).catch(reject);
    });
  },
}

export default api;
export const client = Client;
