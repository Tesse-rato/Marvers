import { Config, mountURL } from './utils';

let fetching = false;
let localhost = 'http://192.168.1.5:3030';


export default {
  getMarvelToken() {
    return new Promise((resolve, reject) => {
      // fetch('http://192.168.1.5:3030/auth', {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' }
      // }).then(resp => {
      //   return resp.json();

      // }).then(({ apikey, token, baseURL, ts }) => {
      //   resolve({ apikey, token, baseURL, ts });

      // }).catch(err => {
      //   reject(err);
      // });
      client(`${localhost}/auth`).then(({ apikey, token, baseURL, ts }) => {
        resolve({ apikey, token, baseURL, ts });
      }).catch(reject)
    });
  },

  /**
  * 
  * @param {token}   token        <String>  // É um has gerado na API local da aplicação
  * @param {baseURL} baseURL      <String>  // Qual dominio da marvel estará usando
  * @param {apikey}  paikey       <String>  // É a chave publica da conta de desenvolvedor da https://marvel.com
  * @param {ts}      time_stamp   <String>  // É um parametro solicitado junto a chamada da marvel API
  * @param {offset}  offset       <String>  // É o parametro de paginação da marvel API e diz a posicao de inicio de leitura no banco
  * @param {limit}   limit        <String>  // É um aparametro que estabelece o limit de documentos entregues por chamada na marvel API
  * @returns {Promise}            <Promise> // Retorna uma Promise
 */
  getCharacters({ token, apikey, ts, offset, limit, baseURL }) {
    return new Promise((resolve, reject) => {
      if (!token || !apikey || !ts) return reject({ err: 'Missing arg params', description: 'Parece estar faltando algum parametro nos argumentos que sem eles a solicitação não pode ser completada, verifique aqui.', params: { token, apikey, ts } });

      const charactersPath = '/v1/public/characters';
      const url = mountURL({ token, apikey, ts, baseURL, path: charactersPath, offset: 0, limit: 40 });
      const error_obj = { error: 'Cannot call the Marvel API', description: 'Não foi possivel solicitar rota /characters, verifique todo ambiente e conexão com internet.' };

      client(url).then(resolve).catch(err => reject({ ...err, ...error_obj }));

    });
  },

  filterCharacters(search) {
    return new Promise((resolve, reject) => {
      client(`${localhost}/characters/search/${search}`).then(({ results }) => {
        resolve(results);
      }).catch(reject);
    });
  },

  getComics({ token, apikey, ts, offset, limit, baseURL }) {
    return new Promise((resolve, reject) => {
      if (fetching) return reject({ alert: 'Calling /v1/public/comics rejected', description: 'Foi tentado fazer uma requisicção enquando uma ainda estava em andamento.' });
      fetching = true;

      if (!token || !apikey || !ts) return reject({ err: 'Missing arg params', description: 'Parece estar faltando algum parametro nos argumentos que sem eles a solicitação não pode ser completada, verifique aqui.', params: { token, apikey, ts } });

      const comicsPath = '/v1/public/comics';
      const url = mountURL({ token, apikey, ts, baseURL, path: comicsPath, offset, limit: 40 });
      const error_obj = { error: 'Cannot call the Marvel API', description: 'Não foi possivel solicitar rota /comics, verifique todo ambiente e conexão com internet.' }

      client(url).then(data => {
        resolve(data);
        fetching = false;
      }).catch(err => reject({ ...err, ...error_obj }));

    });
  },

  /**
   * 
   * @param {id} Id <String> // Id do personagem da Marvel
   */
  getHeroesComics({ id, token, apikey, ts, baseURL, offset, limit }) {
    return new Promise((resolve, reject) => {
      if (!token || !apikey || !ts) return reject({ err: 'Missing arg params', description: 'Parece estar faltando algum parametro nos argumentos que sem eles a solicitação não pode ser completada, verifique aqui.', params: { token, apikey, ts } });

      const horoesComicsPath = `/v1/public/characters/${id}/comics`;
      const url = mountURL({ token, apikey, ts, baseURL, path: horoesComicsPath, offset: 0, limit: 40 });
      const error_obj = { error: 'Cannot call the Marvel API', description: 'Não foi possivel solicitar rota /characters/' + id + '/comics, verifique todo ambiente e conexão com internet.' }

      client(url).then(resolve).catch(err => reject({ ...err, ...error_obj }));

    });
  },

  getComicsDetails({ id, token, apikey, ts, baseURL, offset, limit }) {
    return new Promise((resolve, reject) => {
      if (!token || !apikey || !ts) return reject({ err: 'Missing arg params', description: 'Parece estar faltando algum parametro nos argumentos que sem eles a solicitação não pode ser completada, verifique aqui.', params: { token, apikey, ts } });

      const comicsDetailsPath = `/v1/public/comics/${id}`;
      const url = mountURL({ token, apikey, ts, baseURL, path: comicsDetailsPath });
      const error_obj = { error: 'Cannot call the Marvel API', description: 'Não foi possivel solicitar rota /comics/' + id + ' - verifique todo ambiente e conexão com internet.' }

      client(url).then(resolve).catch(err => reject({ ...err, ...error_obj }));

    });
  },

  getCharacerDetails({ id, token, apikey, ts, baseURL, offset, limit }) {
    return new Promise((resolve, reject) => {
      if (!token || !apikey || !ts) return reject({ err: 'Missing arg params', description: 'Parece estar faltando algum parametro nos argumentos que sem eles a solicitação não pode ser completada, verifique aqui.', params: { token, apikey, ts } });

      const characerDetails = `/v1/public/characters/${id}`;
      const url = mountURL({ token, apikey, ts, baseURL, path: characerDetails });
      const error_obj = { error: 'Cannot call the Marvel API', description: 'Não foi possivel solicitar rota /characters/${id}' + id + ' - verifique todo ambiente e conexão com internet.' }

      client(url).then(resolve).catch(err => reject({ ...err, ...error_obj }));

    });
  }

}

export function client(url) {
  const error_obj = { client: 'Servidor response status is different of 200' };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: Config.default.headers
    }).then(response => {
      return response.json();
    }).then(response => {
      if (response.code === 200 || response.token || response.results)
        resolve(response);
      else
        reject({ data: response, ...error_obj });
    }).catch(err => {
      reject({ data: err });
    });
  });
}