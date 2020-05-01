// constants
import {
  SET_CONNECTED_WALLET,
  SET_WALLET_CONNECTING,
  SET_WALLET_NFT_ASSETS_FETCHING,
  SET_WALLET_NFT_ASSETS,
} from '../constants/walletConstants';


const initialState = {
  isConnecting: false,
  isFetchingNftAssets: false,
  connected: {},
  nftAssets: [],
};

const collectiblesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET_CONNECTING:
      return { ...state, isConnecting: action.payload };
    case SET_CONNECTED_WALLET:
      return { ...state, connected: action.payload, isConnecting: false };
    case SET_WALLET_NFT_ASSETS_FETCHING:
      return { ...state, isFetchingNftAssets: true };
    case SET_WALLET_NFT_ASSETS:
      return { ...state, nftAssets: action.payload, isFetchingNftAssets: false };
    default:
      return state;
  }
};

export default collectiblesReducer;
