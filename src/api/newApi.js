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

function MountFuncs(routes) {
  let baseURL = 'gateway.marvel.com';
  api = {};

  routes.map(route => {
    api[route.name] = ({ id, token, apikey, ts, offset = 0, limit = 40 }) => {
      return new Promise((resolve, reject) => {
        let path = id ? route.path.replace("id", id) : route.path;
        let url = `https://${baseURL}${path}?ts=${ts}&apikey=${apikey}&hash=${token}&limit=${limit}&offset=${offset}`;
        const error_obj = {
          error: 'Cannot call the Marvel API',
          description: `Impossivel solicitar rota ${url} \n\n Verifique sua conexão.`
        };

        client({ url, method: route.method }).then(resolve).catch(err => reject({ ...err, ...error_obj }));
      });
    };
  });

  return api;

}

export function client({ url, method, headers }) {
  if (!url) throw new Error('Faltando url no cliente, precisa de uma url para requisição');
  const error_obj = { client: 'Servidor response status is different of 200' };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method ? method : 'GET',
      headers: headers ? headers : { 'Content-Type': 'application/json' }
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

export default MountFuncs;