export const reducer = (prevState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        return {
          ...prevState,
          token: action.payload.token,
          userId: action.payload.userId
        };
      case 'SIGN_OUT_USER':
        return {
          ...prevState,
          token: null,
          userId: null,
        };
      case 'SET_USER_ID':
        return {
          ...prevState,
          userId: action.payload.userId,
        };
      case 'RM_USER_ID':
        return {
          ...prevState,
          userId: null,
        };
      case 'REMOVE_CURRENT_USER':
        return {
          ...prevState,
          userId: null,
          token: null,
          isAuthenticated: false,
        };
      default:
        return prevState;
    }
  };
  