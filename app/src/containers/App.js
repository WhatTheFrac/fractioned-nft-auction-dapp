import React from 'react';
import styled from 'styled-components';
import ConnectionBanner from '@rimble/connection-banner';

// components
import Wallet from '../components/Wallet';

// utils
import { isSupportedBrowser } from '../utils';


const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <Wrapper>
      {isSupportedBrowser && <Wallet />}
      {!isSupportedBrowser && (
        <ConnectionBanner
          currentNetwork={3}
          requiredNetwork={1}
          onWeb3Fallback={true}
        />
      )}
    </Wrapper>
  );
}

export default App;
