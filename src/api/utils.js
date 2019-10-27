export const Config = {
  default: {
    limit: 20,
    offset: 0,
    baseURL: 'gateway.marvel.com',
    headers: {
      'Content-Type': 'application/json'
    }
  },

}

/**
  * 
  * @param {token}   token        <String> // É um has gerado na API local da aplicação
  * @param {baseURL} baseURL      <String> // Qual dominio da marvel estará usando
  * @param {path}    path         <String> // End-point da marvel API
  * @param {apikey}  paikey       <String> // É a chave publica da conta de desenvolvedor da https://marvel.com
  * @param {ts}      time_stamp   <String> // É um parametro solicitado junto a chamada da marvel API
  * @param {offset}  offset       <String> // É o parametro de paginação da marvel API e diz a posicao de inicio de leitura no banco
  * @param {limit}   limit        <String> // É um aparametro que estabelece o limit de documentos entregues por chamada na marvel API
  * @returns         <String> // Retorna a url montada de acordo com as configurações
 */
export function mountURL({ token, baseURL, path, apikey, ts, offset, limit }) {
  limit = limit ? limit : Config.default.limit;
  offset = offset ? offset : Config.default.offset;
  baseURL = baseURL ? baseURL : Config.default.baseURL;
  return `https://${baseURL}${path}?ts=${ts}&apikey=${apikey}&hash=${token}&limit=${limit}&offset=${offset}`;
}