import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Blockie, MetaMaskButton, Flex, Card, Box, Text, Loader } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';

// actions
import { connectWalletAction } from '../actions/walletActions';
import { getNetworkNameById, truncateHexString } from '../utils';


const Wallet = (props) => {
  const {
    connectWallet,
    wallet: {
      connected: connectedWallet,
      isConnecting,
    },
  } = props;
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      {isEmpty(connectedWallet) && !isConnecting && (
        <MetaMaskButton.Outline onClick={connectWallet}>
          Connect with MetaMask
        </MetaMaskButton.Outline>
      )}
      {!isEmpty(connectedWallet) && !isConnecting && (
        <Card>
          <Flex>
            <Blockie opts={{ seed: connectedWallet.address, size: 20 }} />
            <Box pl={2} pt={2}>
              <Text>Connected Address: {truncateHexString(connectedWallet.address)}</Text>
              <Text fontSize={1}>Network: {getNetworkNameById(connectedWallet.networkId)}</Text>
            </Box>
          </Flex>
        </Card>
      )}
      {isConnecting && <Loader mt={2} size={40} />}
    </Flex>
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
