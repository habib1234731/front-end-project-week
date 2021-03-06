import {
  USER_AUTHENTICATED,
  USER_UNAUTHENTICATED,
  AUTHENTICATION_ERROR,
  CHECK_IF_AUTHENTICATED,
  USER_REGISTERED
} from "../actions";

const token = window.localStorage.getItem("token");

export default (state = { authed: token ? true: false, user: {} }, action) => {
  switch (action.type) {
    case USER_AUTHENTICATED:
      return { ...state, authed: true };
    case USER_UNAUTHENTICATED:
      return { ...state, authed: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
      case USER_REGISTERED:
      return {...state, authed: true, user:action.user}
    case CHECK_IF_AUTHENTICATED:
      return { ...state };
    default:
      return state;
  }
};
