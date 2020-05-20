import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flash, Button, Flex, Box, Text, Loader } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';

// components
import TokenBalance from './TokenBalance';

// actions
import { connectWalletAction } from '../actions/walletActions';

// utils
import { getDaiAddress, getNetworkNameById, truncateHexString } from '../utils';


const BoxWrapper = styled(Box)`
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ConnectedStatus = styled(Flash)`
  margin-left: 10px;
  padding: 2px 25px;
`;

const InlineSeparator = styled.div`
  height: 1px;
  background: #ddd;
  margin: 10px -15px;
`;

const Wallet = (props) => {
  const {
    connectWallet,
    wallet: {
      connected: connectedWallet,
      isConnecting,
    },
  } = props;

  const connectedNetworkValue = connectedWallet.networkId === 1
    ? 'Connected'
    : `Connected (${getNetworkNameById(connectedWallet.networkId)})`;

  const {
    REACT_APP_ACCEPTED_TOKEN_SYMBOL: symbol,
    REACT_APP_ACCEPTED_TOKEN_DECIMALS: decimals,
  } = process.env;
  const address = getDaiAddress(connectedWallet.networkId);

  return (
    <>
      {isEmpty(connectedWallet) && !isConnecting && (
        <Button.Outline size="small" onClick={connectWallet}>Connect wallet</Button.Outline>
      )}
      {!isEmpty(connectedWallet) && !isConnecting && (
        <BoxWrapper px={15} py={2}>
          <Flex justifyContent="center" alignItems="center">
            <Text color="#605e69">{truncateHexString(connectedWallet.address)}</Text>
            <ConnectedStatus variant="success">{connectedNetworkValue}</ConnectedStatus>
          </Flex>
          <InlineSeparator />
          <TokenBalance
            address={address}
            symbol={symbol}
            decimals={Number(decimals)}
            noLogo
          />
        </BoxWrapper>
      )}
      {isConnecting && <Loader mt={2} size={20} />}
    </>
  );
};

Wallet.propTypes = {
  wallet: PropTypes.shape({
    connected: PropTypes.shape({
      address: PropTypes.string,
      networkId: PropTypes.number,
    }),
    isConnecting: PropTypes.bool,
  }),
  connectWallet: PropTypes.func,
};

const mapStateToProps = ({
  wallet,
}) => ({
  wallet,
});

const mapDispatchToProps = {
  connectWallet: connectWalletAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
