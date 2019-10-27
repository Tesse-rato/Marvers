export const types = {
  SCENE_CHARACTERS: 'CHARACTERS',
  SCENE_COMICS: 'COMICS',
  SCENE_BOUGHT: 'SCENE_BOUGHT',
  SCENE_DETAILS: 'SCENE_DETAILS',
  STORAGE_AUTH: 'STORAGE_AUTH',
  STORAGE_CHARACTERS: 'STORAGE_CHARACTERS',
  STORAGE_COMICS: 'STORAGE_COMICS',
  STORAGE_AUTH_CHARACTERS: 'STORAGE_AUTH_CHARACTERS',
  STORAGE_COMIC_HEROES: 'STORAGE_COMIC_HEROES',
  STORAGE_DETAILS: 'STORAGE_DETAILS',
  SET_ENVIRONMENT: 'SET_ENVIRONMENT'
}
export default function globalReducer(state, payload) {
  switch (payload.action) {
    case types.STORAGE_AUTH: {
      return { ...state, auth: { ...state.auth, ...payload.auth } };
    }
    case types.STORAGE_AUTH_CHARACTERS: {
      const accessParams = `?ts=${payload.auth.ts}&apikey=${payload.auth.apikey}&hash=${payload.auth.token}`;
      return { ...state, auth: { ...payload.auth, accessParams }, charactersData: payload.charactersData, environment: { scene: types.SCENE_CHARACTERS } };
    }
    case types.STORAGE_CHARACTERS: {
      return { ...state, charactersData: payload.charactersData, environment: { ...state.environment, scene: types.SCENE_CHARACTERS } };
    }
    case types.STORAGE_COMIC_HEROES: {
      const { comicsData, filterCharacter } = payload;
      return {
        ...state,
        comicsData,
        environment: {
          ...state.environment,
          filterCharacter,
          scene: types.SCENE_COMICS,
        }
      }
    }
    case types.SET_ENVIRONMENT: {
      return { ...state, comicsData: { ...state.comicsData, ...payload.comicsData }, charactersData: { ...state.charactersData, ...payload.charactersData }, environment: { ...state.environment, ...payload.environment } }
    }
    case types.STORAGE_COMICS: {
      return { ...state, comicsData: payload.comicsData, environment: { ...state.environment, scene: types.SCENE_COMICS } };
    }
    case types.STORAGE_DETAILS: {
      return { ...state, comicDetails: payload.comicDetails, environment: { ...state.environment, scene: types.SCENE_DETAILS } };
    }
    default: {
      return state;
    }
  }
}