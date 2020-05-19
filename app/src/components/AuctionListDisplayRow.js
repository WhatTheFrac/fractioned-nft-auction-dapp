import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Button, Text, Link, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionBidDisplay from "./AuctionBidDisplay";
import AuctionCompleteDisplay from "./AuctionCompleteDisplay";
import { theme } from "rimble-ui";

// utils
import { AuctionState } from "../utils";

const ListItem = styled(Card)`
  position: relative;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const AuctionDisplay = ({ nftAssets, auctionAddress, selectAction }) => {
  const getNFTName = () => "Kitties 98524";
  const getNFTImageURL = () =>
    "https://lh3.googleusercontent.com/gy4fPlhB0TJMk228L8mroeCgQxweAE6TCxIVqQ59CychrK4yGZkA98pCEs0INh9xmcpOMf5YMhiR2Vsw2eqMs0_Gkg";
  const auctionEndDisplay = () => "Auction ends in 1 day and 4 hours";
  const lastBidAmount = () => "18 DAI";

  const NFT_SIZE = 80;

  return (
      <ListItem>
        <Flex justifyContent="space-between" alignItems="center" onClick={selectAction}>
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <div style={{ width: NFT_SIZE, height: NFT_SIZE }}>
                <Avatar
                  size={NFT_SIZE+"px"}
                  src={getNFTImageURL()}
                />
              </div>
              <Heading as={"h1"} pl={20}>
                {getNFTName()}
              </Heading>
            </Flex>
            <Text color={theme.colors.grey}>{auctionEndDisplay()}</Text>
          </Flex>
          <Flex flexDirection="column">
            <Button mb={20} onClick={selectAction}>Go To Auction</Button>
            <Text color={theme.colors.grey}>Last bid: {lastBidAmount()}</Text>
          </Flex>
        </Flex>
      </ListItem>
  );
};

AuctionDisplay.propTypes = {
  nftAssets: PropTypes.array,
  auctionAddress: PropTypes.string,
  selectAction: PropTypes.func,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
