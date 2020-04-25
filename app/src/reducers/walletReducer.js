// constants
import {
  SET_CONNECTED_WALLET,
  SET_WALLET_CONNECTING,
} from '../constants/walletConstants';


const initialState = {
  isConnecting: false,
  connected: {},
};

const collectiblesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET_CONNECTING:
      return { ...state, isConnecting: action.payload };
    case SET_CONNECTED_WALLET:
      return { ...state, connected: action.payload, isConnecting: false };
    default:
      return state;
  }
};

export default collectiblesReducer;
