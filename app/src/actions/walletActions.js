import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// constants
import {
  SET_WALLET_CONNECTING,
  SET_CONNECTED_WALLET,
  SET_WALLET_NFT_ASSETS_FETCHING,
  SET_WALLET_NFT_ASSETS,
  SET_TOKEN_BALANCE,
  SET_OPENSEA_NFT_ASSET_FETCHING,
  SET_OPENSEA_NFT_ASSET,
} from '../constants/walletConstants';

import { getKeyForNFT } from "../utils";

// services
import { getNftAssetsByOwnerAddress, getCollectibleByTokenData } from '../services/opensea'

// actions
import { checkPendingTransactionsAction } from './transactionActions';


export const fetchWalletNftAssetsAction = () => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();

  // check if wallet connected
  if (isEmpty(connectedWallet)) return;

  dispatch({ type: SET_WALLET_NFT_ASSETS_FETCHING, payload: true });
  const fetched = await getNftAssetsByOwnerAddress(connectedWallet.address);
  dispatch({ type: SET_WALLET_NFT_ASSETS, payload: fetched });
};


export const fetchCollectibleByTokenData = (address, id) => async (dispatch, getState) => {
  const key = getKeyForNFT(address, id);
  dispatch({ type: SET_OPENSEA_NFT_ASSET_FETCHING, payload: key });
  const fetched = await getCollectibleByTokenData(address, id, 0);
  dispatch({ type: SET_OPENSEA_NFT_ASSET, payload: {key: key, data: fetched} });
};

export const removeNftFromWalletAssetsAction = (uid) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet, nftAssets } } = getState();

  // check if wallet connected
  if (isEmpty(connectedWallet)) return;

  const updated = nftAssets.filter((nft) => nft.uid !== uid);
  dispatch({ type: SET_WALLET_NFT_ASSETS_FETCHING, payload: true });
  dispatch({ type: SET_WALLET_NFT_ASSETS, payload: updated });
};

export const connectWalletAction = () => async (dispatch) => {
  dispatch({ type: SET_WALLET_CONNECTING, payload: true });
  dispatch({ type: SET_WALLET_NFT_ASSETS, payload: [] }); // reset

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      dispatch({ type: SET_WALLET_CONNECTING, payload: false });
      return;
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  }

  const address = await window.web3.eth.getAccounts().then((accounts) => accounts[0]);
  const networkId = Number(window.web3.givenProvider.networkVersion);
  const wallet = { address, networkId };

  dispatch({ type: SET_CONNECTED_WALLET, payload: wallet });
  dispatch(fetchWalletNftAssetsAction());
  dispatch(checkPendingTransactionsAction());
};

export const getConnectedWalletAction = () => async (dispatch) => {
  const address = get(Web3, 'givenProvider.selectedAddress');
  const networkId = get(Web3, 'givenProvider.networkVersion');

  // check if values are present (wallet is available)
  if (!address || !networkId) return;

  window.web3 = new Web3(Web3.givenProvider);

  dispatch({ type: SET_WALLET_CONNECTING, payload: true });
  const wallet = { address, networkId: Number(networkId) };
  dispatch({ type: SET_CONNECTED_WALLET, payload: wallet });
  dispatch(fetchWalletNftAssetsAction());
  dispatch(checkPendingTransactionsAction());
};

export const setTokenBalanceAction = (payload) => ({
  type: SET_TOKEN_BALANCE,
  payload,
})
