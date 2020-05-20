import axios from 'axios';
import get from 'lodash/get';

const THEGRAPH_ID = 'QmRb8p82uFpgtNUThxFpK24KrbD7khJe8rG1qRAn9kUJCR';

const pause = (
  multiplier,
) => new Promise(resolve => setTimeout(resolve, (multiplier || 1) * 1000));

export const loadAllFrac = (attempt) => {
  const url = 'https://api.thegraph.com/subgraphs/id/' + THEGRAPH_ID;

  return axios.post(url, {
    timeout: 5000,
    query: `
      {
        frackedERC721S(first: 25) {
          id
          nftContract
          nftId
          nftReceiver
          nftReceiver
          fracker
          frackTime
          token
          balancerPool
          balancerFlipDuration
          minAuctionBid
          minBidIncrease
          auctionDuration
          lastBidder
          lastBid
        }
      }
    `
  })
    .then(({ data }) => get(data, 'data.frackedERC721S', []))
    .catch(async () => {
      if (attempt === 5) return [];
      await pause(attempt);

      return loadAllFrac(attempt || 2);
    });
};
