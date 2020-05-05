import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Avatar, Card } from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// utils
import { getTokenBalance } from '../utils';


const TokenBalance = ({
  symbol,
  address,
  decimals,
  connectedWalletAddress,
  noLogo,
}) => {
  const [balance, setBalance] = useState(0);
  const [isFetchingTokenBalance, setIsFetchingTokenBalance] = useState(true)

  useEffect(() => {
    if (isFetchingTokenBalance) {
      getTokenBalance(connectedWalletAddress, address, decimals).then((balance) => {
        setBalance(balance);
        setIsFetchingTokenBalance(false);
      })
    }
  }, [connectedWalletAddress])

  return (
    <Flex alignItems="center" flexWrap="wrap">
      {!noLogo && <Avatar src={`https://airswap-token-images.s3.amazonaws.com/${symbol}.png`} mr={2} />}
      <Text style={{ flex: 1 }}>{symbol} Balance</Text>
      {!isFetchingTokenBalance && <Text textAlign="right">{balance.toFixed(6)}</Text>}
      {isFetchingTokenBalance && <Loader ml={3} size={20} />}
    </Flex>
  );
};

TokenBalance.propTypes = {
  connectedWalletAddress: PropTypes.string,
  symbol: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
  noLogo: PropTypes.bool,
};

const mapStateToProps = ({
  wallet: { connected: { address: connectedWalletAddress } },
}) => ({
  connectedWalletAddress,
});

export default connect(mapStateToProps)(TokenBalance);
