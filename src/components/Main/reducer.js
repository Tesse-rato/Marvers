export default function MainReducer(state, payload) {
  switch (payload.action) {
    case 'STORAGE_AUTH': {
      return { ...state, auth: payload.auth }
    }

    default: {
      return { ...state }
    }
  }
}