import Web3 from 'web3';

// constants
import {
  SET_WALLET_CONNECTING,
  SET_CONNECTED_WALLET,
} from '../constants/walletConstants';


export const connectWalletAction = () => async (dispatch) => {
  dispatch({ type: SET_WALLET_CONNECTING, payload: true });

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

  dispatch({ type: SET_CONNECTED_WALLET, payload: wallet })
};
