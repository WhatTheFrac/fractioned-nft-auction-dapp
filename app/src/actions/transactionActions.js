import get from 'lodash/get';

// constants
import {
  ADD_TRANSACTION,
  ADD_ALL_FRAC,
  SET_TRANSACTION_CONFIRMED,
  STATUS_PENDING,
  TRANSACTION_TYPE,
  SET_WAITING_FOR_TRANSACTION_SUBMIT,
  RESET_FRACTIONATE_TRANSACTION,
  SET_FRACS_FETCHING,
} from '../constants/transactionConstants';

// assets
import frackerAbi from '../assets/abi/fracker.json';

import { loadAllFrac } from '../services/contracts';

// utils
import {
  createTokenSymbol,
  formatTokenAmount,
  getDaiAddress,
  getERC20Contract,
  getERC721Contract,
  getFrackerContractAddress,
  isCaseInsensitiveEqual,
} from '../utils';

export const getLoadAllFracAction = () => async (dispatch, getState) => {
  dispatch({ type: SET_FRACS_FETCHING });
  const allFrac = await loadAllFrac();
  dispatch({
    type: ADD_ALL_FRAC,
    payload: allFrac,
  });
};

export const approveTokenTransactionAction = (amount, address) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();
  const { address: connectedWalletAddress, networkId } = connectedWallet;
  const daiAddress = getDaiAddress(networkId);
  const DaiContract = getERC20Contract(daiAddress);
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  DaiContract.methods
    .approve(address, formatTokenAmount(amount))
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.FRACTIONATE_TOKEN_APPROVE,
        status: STATUS_PENDING,
      };
      dispatch({ type: ADD_TRANSACTION, payload: transaction })
    })
    .then((result) => {
      const resultTransactionHash = get(result, 'transactionHash');
      if (!resultTransactionHash) return; // TODO: transaction failed notification
      dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: resultTransactionHash })
    })
    .catch(() => {});
};

export const approveNftTransactionAction = (nftTokenAddress, nftTokenId, address) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();
  const { address: connectedWalletAddress } = connectedWallet;
  const ERC721Contract = getERC721Contract(nftTokenAddress);
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  ERC721Contract.methods
    .approve(address, nftTokenId)
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.FRACTIONATE_NFT_APPROVE,
        status: STATUS_PENDING,
      };
      dispatch({ type: ADD_TRANSACTION, payload: transaction })
    })
    .then((result) => {
      const resultTransactionHash = get(result, 'transactionHash');
      if (!resultTransactionHash) return; // TODO: transaction failed notification
      dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: resultTransactionHash })
    })
    .catch(() => {});
};

export const resetFractionateTransactionAction = () => ({ type: RESET_FRACTIONATE_TRANSACTION })

export const fractionateTransactionAction = (
  nftAddress,
  nftId,
  nftName,
  nftTokenSupplyAmount,
  nftTokenSellAmount,
  nftEstimatedValue,
  minBid,
  minBidIncrease,
  auctionDurationSeconds,
) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();
  const { address: connectedWalletAddress, networkId } = connectedWallet;
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  const frackerContractAddress = getFrackerContractAddress(networkId);
  const FrackerContract = new window.web3.eth.Contract(frackerAbi, frackerContractAddress);
  const createBalancerPool = nftTokenSellAmount > 0;
  FrackerContract.methods
    .fractionalize(
      nftAddress, // address _nftAddress,
      nftId, //   uint256 _nftId,
      createTokenSymbol(nftName), //   string memory _symbol,
      formatTokenAmount(nftTokenSupplyAmount, 18), //   uint256 _initialSupply,
      createBalancerPool ? formatTokenAmount(nftTokenSellAmount, 18) : 0, //   uint256 _amountToPool,
      formatTokenAmount(nftEstimatedValue, 18), //   uint256 _targetPrice, // estimated value of nft
      createBalancerPool ? auctionDurationSeconds - 1 : 0, //   uint256 _balancerFlipDuration, // How long it takes to flip the weight
      formatTokenAmount(minBid), //   uint256 _minAuctionBid,
      minBidIncrease, //   uint256 _minBidIncrease,
      auctionDurationSeconds, //   uint256 _auctionDuration
    )
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.FRACTIONATE,
        status: STATUS_PENDING,
      };
      dispatch({ type: ADD_TRANSACTION, payload: transaction })
    })
    .then((result) => {
      const resultTransactionHash = get(result, 'transactionHash');
      if (!resultTransactionHash) return; // TODO: transaction failed notification
      dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: resultTransactionHash })
    })
    .catch(() => {});
};

export const checkPendingTransactionsAction = () => async (dispatch, getState) => {
  const {
    transactions: { data: transactions },
    wallet: { connected: { address: connectedWalletAddress } }
  } = getState();

  // filter
  const isConnectedWalletPendingTransaction = ({
    status,
    from,
  }) => status === STATUS_PENDING && isCaseInsensitiveEqual(from, connectedWalletAddress);

  // check pending transactions for connected wallet
  await Promise.all(
    transactions
      .filter(isConnectedWalletPendingTransaction)
      .map(async ({ hash }) => {
        const transaction = await window.web3.eth
          .getTransactionReceipt(hash)
          .catch(() => null);
        if (transaction === null) return;
        dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: hash })
      })
  )

  // check if any pending left
  if (!transactions.some(isConnectedWalletPendingTransaction)) return;

  // some transactions are still pending, check once mor after 1s
  setTimeout(() => dispatch(checkPendingTransactionsAction()), 1000);
};

export const bidAuctionTransactionAction = (auctionId, bidAmount) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet, networkId } } = getState();
  const { address: connectedWalletAddress } = connectedWallet;
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  const frackerContractAddress = getFrackerContractAddress(networkId);
  const FrackerContract = new window.web3.eth.Contract(frackerAbi, frackerContractAddress);
  FrackerContract.methods
    .bid(auctionId, formatTokenAmount(bidAmount, 18))
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.FRACTIONATE_AUCTION_BID,
        status: STATUS_PENDING,
      };
      dispatch({ type: ADD_TRANSACTION, payload: transaction })
    })
    .then((result) => {
      const resultTransactionHash = get(result, 'transactionHash');
      if (!resultTransactionHash) return; // TODO: transaction failed notification
      dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: resultTransactionHash })
    })
    .catch(() => {});
};

export const settleAuctionTransactionAction = (auctionId) => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet, networkId } } = getState();
  const { address: connectedWalletAddress } = connectedWallet;
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  const frackerContractAddress = getFrackerContractAddress(networkId);
  const FrackerContract = new window.web3.eth.Contract(frackerAbi, frackerContractAddress);
  FrackerContract.methods
    .settle(auctionId)
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.FRACTIONATE_SETTLE_AUCTION,
        status: STATUS_PENDING,
      };
      dispatch({ type: ADD_TRANSACTION, payload: transaction })
    })
    .then((result) => {
      const resultTransactionHash = get(result, 'transactionHash');
      if (!resultTransactionHash) return; // TODO: transaction failed notification
      dispatch({ type: SET_TRANSACTION_CONFIRMED, payload: resultTransactionHash })
    })
    .catch(() => {});
};
