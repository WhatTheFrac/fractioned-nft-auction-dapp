import React from "react";
import styled from "styled-components";
import { Button, Text, Card, Link, Flex, Image, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { theme } from "rimble-ui";

// utils
import {
  getTimeRemainingDisplay,
  TimeGranularity,
  EMPTY_ADDRESS,
  getKeyForNFT,
  parseTokenAmount,
} from '../utils';

const ListItem = styled(Card)`
  position: relative;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const BALANCER_SWAP_ADDRESS = 'https://balancer.exchange/#/swap/';

const AuctionDisplay = ({ auction, selectAction, openSeaAssets }) => {
  let openSeaKey = getKeyForNFT(auction.nftContract, auction.nftId);

  let nftName;
  let nftImageURL;
  try{
    nftName = openSeaAssets[openSeaKey].name;
    nftImageURL = openSeaAssets[openSeaKey].image_url;
  } catch (e) {
    nftName = "..."
    nftImageURL = "";
  }

  const getAuctionEndTimestampMS = () =>
    (parseInt(auction.frackTime) + parseInt(auction.auctionDuration)) * 1000;
  const timeRemaining = Math.max(getAuctionEndTimestampMS() - +new Date(), 0);

  let timerDisplay = timeRemaining === 0
    ? "Fractionate is complete."
    : "Ends in " + getTimeRemainingDisplay(timeRemaining, TimeGranularity.MINUTES);

  const NFT_DISPLAY_SIZE = 80;

  let balancerLink = null;
  if (auction.balancerPool !== EMPTY_ADDRESS && auction.token != null) {
    let balancerAddress = BALANCER_SWAP_ADDRESS + auction.token;
    balancerLink =
      <Link
        href={balancerAddress}
        color={theme.colors.grey}
        activeColor={theme.colors["dark-gray"]}
        hoverColor={theme.colors["dark-gray"]}
        fontSize={2}
        target="_blank"
        title="Go to the associated balancer pool">
        Check Balancer Pool →
      </Link>;
  }

  return (
      <ListItem>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={10}>
              <div style={{ width: NFT_DISPLAY_SIZE, height: NFT_DISPLAY_SIZE, boxShadow: "0px 0px 10px #888888" }}>
                <Image
                  height={NFT_DISPLAY_SIZE+"px"}
                  width={NFT_DISPLAY_SIZE+"px"}
                  src={nftImageURL}
                />
              </div>
              <Heading as={"h1"} pl={20}>
                {nftName}
              </Heading>
            </Flex>
            <Text color={theme.colors.grey} my={20}>{timerDisplay}</Text>
            {balancerLink}
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Button mb={20} onClick={selectAction}>Go To Auction</Button>
            <Text color={theme.colors.grey}>Current bid: {parseTokenAmount(auction.lastBid)} DAI</Text>
          </Flex>
        </Flex>
      </ListItem>
  );
};

AuctionDisplay.propTypes = {
  auction: PropTypes.any,
  selectAction: PropTypes.func,
  openSeaAssets: PropTypes.object,
};

export default AuctionDisplay;
