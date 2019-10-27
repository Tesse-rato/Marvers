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

  const handleComicClick = () => {
    api.getComicsDetails({ ...globalState.auth, id }).then(({ data }) => {
      setGlobalState({ action: types.STORAGE_DETAILS, comicDetails: data });
    }).catch(err => console.log(err));
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