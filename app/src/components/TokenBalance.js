import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Avatar } from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// utils
import { getTokenBalance } from '../utils';

// actions
import { setTokenBalanceAction } from '../actions/walletActions';


const TokenBalance = ({
  symbol,
  address,
  decimals,
  connectedWalletAddress,
  noLogo,
  balances,
  setTokenBalance,
}) => {
  const { balance = 0 } = balances.find((balance) => balance.symbol === symbol) || {};
  const [isFetchingTokenBalance, setIsFetchingTokenBalance] = useState(true)

  useEffect(() => {
    if (isFetchingTokenBalance) {
      getTokenBalance(connectedWalletAddress, address, decimals).then((balance) => {
        setTokenBalance({ symbol, balance });
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
  balances: PropTypes.arrayOf(PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.number,
  })),
  setTokenBalance: PropTypes.func,
};

const mapStateToProps = ({
  wallet: { connected: { address: connectedWalletAddress }, balances },
}) => ({
  connectedWalletAddress,
  balances,
});

const mapDispatchToProps = {
  setTokenBalance: setTokenBalanceAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenBalance);
