import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ConnectionBanner from '@rimble/connection-banner';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Loader, Box, Flex, Text } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';

// components
import Wallet from '../components/Wallet';
import NftAssetsSelect from '../components/NftAssetsSelect';
import TokenBalance from '../components/TokenBalance';
import FractionateButton from '../components/FractionateButton';
import Tabs from '../components/Tabs';

// utils
import { isSupportedBrowser } from '../utils';

// actions
import { getConnectedWalletAction } from '../actions/walletActions';

const PageWrapper = styled.div`
  height: 80vh;
  display: flex;
  justify-content: center;
  margin: 10vw 10vh;
`;

const App = (props) => {
  const { getConnectedWallet, connectedWallet } = props;

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (appLoading) {
      getConnectedWallet();
      setAppLoading(false);
    }
  }, [appLoading]);

  if (!isSupportedBrowser) {
    return (
      <ConnectionBanner
        currentNetwork={3}
        requiredNetwork={1}
        onWeb3Fallback={true}
      />
    );
  }

  const isWalletConnected = !isEmpty(connectedWallet);

  let tabData = [
    {
      title: "Fractionate",
      content: (
        <Flex flexDirection="column" justifyContent="center">
          <Wallet />
          {isWalletConnected && (
            <>
              <Box mt={3}>
                <TokenBalance
                  symbol={process.env.REACT_APP_ACCEPTED_TOKEN_SYMBOL}
                  address={process.env.REACT_APP_ACCEPTED_TOKEN_ADDRESS}
                  decimals={Number(process.env.REACT_APP_ACCEPTED_TOKEN_DECIMALS)}
                />
              </Box>
              <Box mt={3}>
                <NftAssetsSelect borderless />
              </Box>
            </>
          )}
          <FractionateButton />
        </Flex>
      )
    },
    {
      title: "Pool",
      content: (
        <Text>The Balancer pool!!!!!!!!!</Text>
      )
    }
  ];

  return (
    <PageWrapper>
      {appLoading && <Loader size={70} />}
      {!appLoading && (<Tabs tabData={tabData} />)}
    </PageWrapper>
  );
};

App.propTypes = {
  getConnectedWallet: PropTypes.func,
  connectedWallet: PropTypes.object,
};

const mapStateToProps = ({
  wallet: { connected: connectedWallet },
}) => ({
  connectedWallet,
});

const mapDispatchToProps = {
  getConnectedWallet: getConnectedWalletAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
