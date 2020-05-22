// constants
import {
  SET_CONNECTED_WALLET,
  SET_WALLET_CONNECTING,
  SET_WALLET_NFT_ASSETS_FETCHING,
  SET_WALLET_NFT_ASSETS,
  SET_TOKEN_BALANCE,
  SET_OPENSEA_NFT_ASSET_FETCHING,
  SET_OPENSEA_NFT_ASSET,
} from '../constants/walletConstants';


const initialState = {
  isConnecting: false,
  isFetchingNftAssets: false,
  connected: {},
  nftAssets: [],
  balances: [],
  isFetchingOpenseaAssets: {},
  openSeaAssets: {},
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
    case SET_OPENSEA_NFT_ASSET_FETCHING:
      return {
        ...state,
        isFetchingOpenseaAssets: {
          ...state.isFetchingOpenseaAssets,
          [action.payload]: true,
        }
      };
    case SET_OPENSEA_NFT_ASSET:
      return {
        ...state,
        isFetchingOpenseaAssets: {
          ...state.isFetchingOpenseaAssets,
          [action.payload.key]: false,
        },
        openSeaAssets: {
          ...state.openSeaAssets,
          [action.payload.key]: action.payload.data,
        }
      };
    case SET_TOKEN_BALANCE:
      const { symbol } = action.payload;
      const currentBalances = state.balances.filter((balance) => balance.symbol !== symbol);
      return { ...state, balances: [...currentBalances, action.payload] };
    default:
      return state;
  }
};

export default collectiblesReducer;
