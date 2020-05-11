import isEmpty from 'lodash/isEmpty';

import {
  SET_WALLET_NFT_ASSETS,
  SET_WALLET_NFT_ASSETS_FETCHING,
} from 'app/src/constants/walletConstants';
import { getNftAssetsByOwnerAddress } from 'app/src/services/opensea';

export const executeFractionateTransactionAction = (data) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();
  // address _nftAddress,
  // uint256 _nftId,
  // address _nftReceiver,
  // bytes memory _nftReceiverData,
  // string memory _tokenName,
  // string memory _symbol,
  // uint256 _initialSupply,
  // address _tokenReceiver,
  // bytes memory _tokenReceiverData
};
