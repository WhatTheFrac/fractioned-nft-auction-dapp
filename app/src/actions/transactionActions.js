import get from 'lodash/get';

// constants
import {
  ADD_TRANSACTION,
  SET_TRANSACTION_CONFIRMED,
  STATUS_PENDING,
  TRANSACTION_TYPE,
  SET_WAITING_FOR_TRANSACTION_SUBMIT,
} from '../constants/transactionConstants';

// assets
import erc20Abi from '../assets/abi/erc20.json';

// utils
import {
  formatTokenAmount,
  getDaiAddress,
  isCaseInsensitiveEqual,
} from '../utils';


export const approveTokenTransactionAction = () => async (dispatch, getState) => {
  const { wallet: { connected: connectedWallet } } = getState();
  const { address: connectedWalletAddress, networkId } = connectedWallet;
  const daiAddress = getDaiAddress(networkId);
  const DaiContract = new window.web3.eth.Contract(erc20Abi, daiAddress);
  dispatch({ type: SET_WAITING_FOR_TRANSACTION_SUBMIT });
  const result = await DaiContract.methods
    // TODO: change to contract address and actual value
    .approve('0x8096Da6cEd12B75684054ef16e1bf7e376353c29', formatTokenAmount(0.1))
    .send({ from: connectedWalletAddress }, (err, hash) => {
      if (err) return; // TODO: transaction failed notification
      const transaction = {
        hash,
        from: connectedWalletAddress,
        type: TRANSACTION_TYPE.TOKEN_APPROVE,
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
