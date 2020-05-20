import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';
import toLower from 'lodash/toLower';
import { utils as ethersUtils } from 'ethers';

// assets
import erc20Abi from '../assets/abi/erc20.json';


export const truncateHexString = (targetString) => {
  if (!targetString) return '';

  const startCharsCount = 6;
  const endCharsCount = 4;
  const separator = '...';
  const totalTruncatedSum = startCharsCount + endCharsCount + separator.length;

  const words = targetString.toString().split(' ');
  const firstWord = words[0];

  if (words.length === 1) {
    if (firstWord.length <= totalTruncatedSum) return firstWord;
    return `${firstWord.slice(0, startCharsCount)}${separator}${firstWord.slice(-endCharsCount)}`;
  }

  return targetString;
};

export const isSupportedBrowser = !isEmpty(Web3.givenProvider);

export const getNetworkNameById = (networkId) => {
  switch (Number(networkId)) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 42:
      return 'Kovan';
    default:
      return 'Unknown network';
  }
};

export const pauseForSeconds = (seconds) => new Promise(resolve => setTimeout(resolve, (seconds || 1) * 1000));

export const getERC20Contract = (address) => new window.web3.eth.Contract(erc20Abi, address);

export const parseTokenAmount = (value, decimals = 18) => Number(
  decimals > 0 ? ethersUtils.formatUnits(value.toString(), decimals) : value.toString(),
);

export const getTokenBalance = (
  walletAddress,
  tokenAddress,
  tokenDecimals,
) => getERC20Contract(tokenAddress).methods.balanceOf(walletAddress).call()
    .then((balanceInWei) => parseTokenAmount(balanceInWei, tokenDecimals))
    .catch(() => 0);

export const getTokenAllowance = (
  walletAddress,
  allowanceAddress,
  tokenAddress,
  tokenDecimals,
) => getERC20Contract(tokenAddress).methods.allowance(walletAddress, allowanceAddress).call()
    .then((allowanceInWei) => parseTokenAmount(allowanceInWei, tokenDecimals))
    .catch(() => 0);

export const parseNumberInputValue = (rawValue, noDecimals) => {
  let value = rawValue
    .replace(/[^0-9.,]+/g, '')
    .replace(/[,]+/g, '.');
  if (noDecimals) {
    value = value.replace(/[.]+/g, '');
  } else if (value.indexOf('.') !== value.lastIndexOf('.')) {
    const [first, ...rest] = value.split('.');
    value = `${first}.${rest.join('')}`;
  }
  if (!value) value = '';
  return value;
};

export const isCaseInsensitiveEqual = (a, b) => {
  if (!a || !b) return false;
  if (a === b) return true;
  return toLower(a) === toLower(b);
};

export const getDaiAddress = (networkId) => {
  if (networkId === 1) return process.env.REACT_APP_ACCEPTED_TOKEN_ADDRESS_MAINNET;
  return process.env.REACT_APP_ACCEPTED_TOKEN_ADDRESS_RINKEBY;
};

export const getFrackerContractAddress = (networkId) => {
  if (networkId === 1) return process.env.REACT_APP_FRACKER_CONTRACT_ADDRESS_MAINNET;
  return process.env.REACT_APP_FRACKER_CONTRACT_ADDRESS_RINKEBY;
};

export const formatTokenAmount = (value, decimals = 18) => ethersUtils.parseUnits(value.toString(), decimals);

export const getEtherscanHostname = (networkId) => ` https://${networkId === 1 ? '' : 'rinkeby.'}etherscan.io`;

export const getTransactionDetailsLink = (hash, networkId) => `${getEtherscanHostname(networkId)}/tx/${hash}`;

export const createTokenSymbol = (title) => title
  .trim()
  .split(' ')
  .map((word) => word.charAt(0))
  .join('')
  .toUpperCase();

export const AuctionState = {
  // auction running states
  NO_BIDS: 'no_bids',
  HIGHEST_BIDDER: 'highest_bidder',
  EXISTING_BIDS: 'existing_bids',
  // auction complete states
  WON_NFT: 'won_nft',
  WON_PAYOUT: 'won_payout',
  AUCTION_OVER: 'auction_over',
};
