import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';


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
