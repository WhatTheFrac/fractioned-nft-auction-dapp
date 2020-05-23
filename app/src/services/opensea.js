import axios from 'axios';
import qs from 'qs';

// utils
import { pauseForSeconds } from '../utils';


const mapFromOpenSea = ({
  name,
  background_color: backgroundColor,
  token_id: tokenId,
  image_url: image,
  image_preview_url: preview,
  asset_contract: { address: tokenAddress },
  traits = [],
}) => {
  const attributes = traits.map(({ trait_type: title, value }) => ({ title, value }));
  return {
    uid: `${tokenAddress}-${tokenId}`,
    title: name || 'Unnamed ERC-721',
    backgroundColor,
    image: image || preview,
    tokenAddress,
    tokenId,
    attributes,
  };
};

const getOpenseaApiPrefix = () => {
  const networkId = Number(window?.web3?.givenProvider?.networkVersion || 1);
  return networkId === 1 ? '' : 'rinkeby-';
}

export const getNftAssetsByOwnerAddress = (ownerAddress, attempt) => {
  const query = {
    owner: ownerAddress,
    exclude_currencies: true,
    order_by: 'listing_date',
    order_direction: 'asc',
    limit: 200,
  };
  const apiPrefix = getOpenseaApiPrefix();
  const url = `https://${apiPrefix}api.opensea.io/api/v1/assets/?${qs.stringify(query)}`;
  return axios.get(url, {
    timeout: 5000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY,
    },
  })
    .then(({ data: { assets } }) => assets || [])
    .then((result) => result.map(mapFromOpenSea))
    .catch(async () => {
      // request again if throttled
      if (attempt === 5) return [];
      await pauseForSeconds(attempt);
      return getNftAssetsByOwnerAddress(ownerAddress, attempt || 2);
    });
};

export const getCollectibleByTokenData = (tokenAddress, tokenId, attempt) => {
  const query = {
    asset_contract_address: tokenAddress,
    token_ids: tokenId,
    exclude_currencies: true,
    order_by: 'listing_date',
    order_direction: 'asc',
    limit: 200,
  };
  const apiPrefix = getOpenseaApiPrefix();
  const url = `https://${apiPrefix}api.opensea.io/api/v1/assets/?${qs.stringify(query)}`;
  return axios.get(url, {
    timeout: 5000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY,
    },
  })
    .then(({ data: asset }) => asset.assets[0])
    .catch(async (error) => {
      if (attempt === 5) return [];
      await pauseForSeconds(attempt);
      return getCollectibleByTokenData(tokenAddress, tokenId, attempt || 2);
    });
};
