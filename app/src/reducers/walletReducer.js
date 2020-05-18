// constants
import {
  SET_CONNECTED_WALLET,
  SET_WALLET_CONNECTING,
  SET_WALLET_NFT_ASSETS_FETCHING,
  SET_WALLET_NFT_ASSETS,
  SET_TOKEN_BALANCE,
} from '../constants/walletConstants';


const initialState = {
  isConnecting: false,
  isFetchingNftAssets: false,
  connected: {},
  nftAssets: [],
  balances: [],
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
    case SET_TOKEN_BALANCE:
      const { symbol } = action.payload;
      const currentBalances = state.balances.filter((balance) => balance.symbol !== symbol);
      return { ...state, balances: [...currentBalances, action.payload] };
    default:
      return state;
  }
};

export default collectiblesReducer;
