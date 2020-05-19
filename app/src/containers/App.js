import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ConnectionBanner from '@rimble/connection-banner';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Loader, Box, Flex, Text, Flash } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';

// components
import Wallet from '../components/Wallet';
import FractionateForm from '../components/FractionateForm';
import AuctionListDisplay from '../components/AuctionListDisplay';
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

const CenteredPageWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopRight = styled.div`
  position: absolute;
  top: 10px;
  right: 50px;
  background: white;
  z-index: 1000000;
`;

const CONTENT_WIDTH = 700;

const App = (props) => {
  const { getConnectedWallet, connectedWallet } = props;

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (appLoading) {
      getConnectedWallet();
      setAppLoading(false);
    }
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        getConnectedWallet();
      });
    }
  }, [appLoading]);

  if (!isSupportedBrowser) {
    return (
      <CenteredPageWrapper>
        <ConnectionBanner
          currentNetwork={3}
          requiredNetwork={1}
          onWeb3Fallback={true}
        />
      </CenteredPageWrapper>
    );
  }

  const isWalletConnected = !isEmpty(connectedWallet);

  let tabData = [
    {
      title: "Fractionate",
      content: isWalletConnected && <FractionateForm />
    },
    {
      title: "Sell",
      content: <Text textAlign="center">(╯°□°)╯︵ [AUCTION]</Text>,
    },
    {
      title: "Auctions",
      content: <AuctionListDisplay />,
    },
  ];

  return (
    <PageWrapper>
      {appLoading && <Loader size={70} />}
      {!appLoading && (
        <Flex flexDirection="column" width={CONTENT_WIDTH}>
          <TopRight>
            <Wallet />
          </TopRight>
          <Flash my={3} variant="danger">
            This is untested and is not guaranteed to work. Do not use with any real funds or items.
          </Flash>
          <Box>
            <Tabs tabData={tabData} />
          </Box>
        </Flex>
      )}
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
