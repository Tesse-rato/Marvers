
/**
 * 
 * @param {data} data        <Array>   // Array no qual tem intenção de estrair as linhas
 * @param {columns} columns  <Number>  // Numero de colunas que terão essas colunas
 * @returns {Promise}                  // Retorna uma Promise
 */
export function createDataRows({ data, columns }) {
  return new Promise((resolve, reject) => {
    try {
      let newData = new Array();

      for (let i = 0; i < data.length; i += columns) {

        let cache = new Array();

        for (let j = 0; j < columns; j++) {
          if (data[i + j] == undefined) break;

          cache.push(data[i + j]);
        }

        newData.push(cache);
      }

      resolve(newData);

    } catch (err) {
      reject({ data: err, error: 'Can\'t create a dataRow', description: 'Catch capturou um erro enquanto tentava executar um laço para gerar um array bidimensional atraves dum array simples' });
      throw new Error(err);
    }
  });
}