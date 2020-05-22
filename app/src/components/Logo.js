import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flash, Button, Image, Flex, Box, Text, Loader } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';

// components
import TokenBalance from './TokenBalance';

// actions
import { connectWalletAction } from '../actions/walletActions';

// utils
import { getDaiAddress, getNetworkNameById, truncateHexString } from '../utils';


const LogoWrapper = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
`;


const LOGO_SIZE = 40;

const Logo = (props) => {
  return (
    <LogoWrapper>
      <Flex alignItems="center">
        <div style={{ width: LOGO_SIZE, height: LOGO_SIZE, margin: 20 }}>
          <Image
            height={LOGO_SIZE+"px"}
            width={LOGO_SIZE+"px"}
            src="logo256.png"
          />
        </div>
        <Text mt={2} lineHeight={1} fontWeight={4} fontSize={4}>What the Frac</Text>
      </Flex>
    </LogoWrapper>
  );
};


export default Logo;
