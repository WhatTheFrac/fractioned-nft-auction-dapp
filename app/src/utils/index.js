import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';
import toLower from 'lodash/toLower';
import { utils as ethersUtils } from 'ethers';

// assets
import erc20Abi from '../assets/abi/erc20.json';
import erc721Abi from '../assets/abi/erc721.json';


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

export const getERC721Contract = (address) => new window.web3.eth.Contract(erc721Abi, address);

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

export const isNftTransferApproved = (
  addressToCheck,
  tokenAddress,
  tokenId,
) => getERC721Contract(tokenAddress).methods.getApproved(tokenId).call()
    .then((approvedAddress) => isCaseInsensitiveEqual(approvedAddress, addressToCheck))
    .catch(() => false);

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

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ExplanationString = {
  depositNftExplanation:
    "The NFT that you would like to create fractional shares for, and sell in an auction.",
  daiAllowanceExplanation: `
    Based on the value of the NFT you specified and the portion you would like to sell,
    you will need to the balancer pool with 2% of the value of the tokens provided in DAI.
  `,
  mintFractionExplanation: `
    This is the number of fractional tokens you would like to create,
    these will represent ownership of the NFT and holders will get a proportional
    fraction of the auction proceeds.
  `,
  sellFractionExplanation: `
    The number of the newly created fractional tokens you would like to distribute
    through a Balancer pool. This will take an even value of DAI that you provide and
    fractional tokens, calculated based on the estimated NFT value in DAI in the first box.
    The pool will start at a 2:98 value of DAI:Fractional Tokens, and will flip to 98:2 over time,
    while arbitrageurs buy and sell the tokens during this time, leaving you with DAI that arbitrageurs
    provided in place of the fractional tokens you provided. The flip duration will be equal to the
    auction duration provided above.
    NOTE: If you do not wish to distribute the tokens in this way, select None.
  `,
  auctionExplanation:
    "Details of the auction in which this NFT is sold and you get your share of the proceeds.",
  auctionDurationExplanation: "How long from now the Auction will conclude.",
}

export const TimeGranularity = {
  DAYS: 'DAYS',
  HOURS: 'HOURS',
  MINUTES: 'MINUTES',
  SECONDS: 'SECONDS',
};


export const getTimeRemainingDisplay = (timeRemaining, timeGranularity) => {
  if (timeGranularity == null || !(timeGranularity in TimeGranularity)) {
    timeGranularity = TimeGranularity.MINUTES;
  }

  let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  let seconds = Math.floor((timeRemaining / 1000) % 60);

  let mustShow = false;
  let timerDisplay = "";

  if (days) {
    timerDisplay = timerDisplay.concat(" " + days + " " + (days > 1 ? "days" : "day"));
    mustShow = true;
  }
  if (timeGranularity === TimeGranularity.DAYS) return timerDisplay;

  if (hours || mustShow) {
    timerDisplay = timerDisplay.concat(" " + hours + " " + (hours > 1 ? "hours" : "hour"));
    mustShow = true;
  }
  if (timeGranularity === TimeGranularity.HOURS) return timerDisplay;

  if (minutes || mustShow) {
    timerDisplay = timerDisplay.concat(" " + minutes + " " + (minutes > 1 ? "minutes" : "minute"));
    mustShow = true;
  }
  if (timeGranularity === TimeGranularity.MINUTES) return timerDisplay;

  if (seconds || mustShow) {
    timerDisplay = timerDisplay.concat(" " + seconds + " " + (seconds > 1 ? "seconds" : "second"));
    mustShow = true;
  }
  if (timeGranularity === TimeGranularity.SECONDS) return timerDisplay;

  return timerDisplay;
}

export const getKeyForNFT = (address, id) => "NFT:" + address + ":" + id;
