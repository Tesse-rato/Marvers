/**
 * Esse component e filho de *../../pages/Comics*
 * 
 * Ele é a representação visual final com as imagens e informacoes da Comic
 * 
 * Evolta de um botao que dispara uma chamada para pegar os detalhes da Comic na Api Marvel
 * Ao retorno da chama ele configura o ambiente da aplicação
 * Os outros componentes reagem a essas alterações no ambiente
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, ComicImage, TitleContainer, Title, Variant, Name } from "./styles";

import { GLOBAL_CTX } from '../../store';
import api from '../../api';
import { types } from '../../store/reducer';

export default ({ title, thumbnail, id }) => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);

  const [ti, subTi] = title.split('#');
  const [nam, subNam] = ti.split(':');

  const handleComicClick = () => { // Ao clicar em Comic é buscado a Comic com filtro de Personagem na API
    api.getComicsDetails({ ...globalState.auth, id }).then(({ data }) => {
      setGlobalState({ action: types.STORAGE_DETAILS, comicDetails: data });
    }).catch(err => console.log(err, 'Erro pra pegar Comic'));
  }

  return (
    <Container>
      <TouchableOpacity onPress={handleComicClick}>
        <>
          <ComicImage source={{ uri: thumbnail.path + '.' + thumbnail.extension + globalState.auth.accessParams }} />

          <TitleContainer>
            <Title>{nam}</Title>
            {subNam && <Name>{subNam}</Name>}
            {subTi && <Variant>{'#' + subTi}</Variant>}
          </TitleContainer>
        </>
      </TouchableOpacity>
    </Container>
  );
};