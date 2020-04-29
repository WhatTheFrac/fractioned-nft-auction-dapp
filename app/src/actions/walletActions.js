import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// constants
import {
  SET_WALLET_CONNECTING,
  SET_CONNECTED_WALLET,
  SET_WALLET_NFT_ASSETS_FETCHING,
  SET_WALLET_NFT_ASSETS,
} from '../constants/walletConstants';

// services
import { getNftAssetsByOwnerAddress } from '../services/opensea'


export const fetchWalletNftAssetsAction = () => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();

  // check if wallet connected
  if (isEmpty(connectedWallet)) return;

  dispatch({ type: SET_WALLET_NFT_ASSETS_FETCHING, payload: true });
  const fetched = await getNftAssetsByOwnerAddress(connectedWallet.address);
  dispatch({ type: SET_WALLET_NFT_ASSETS, payload: fetched });
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
};
