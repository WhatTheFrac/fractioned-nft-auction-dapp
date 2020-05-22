import React from "react";
import styled from "styled-components";
import { Avatar, Button, Text, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { theme } from "rimble-ui";

// utils
import { getTimeRemainingDisplay, TimeGranularity, EMPTY_ADDRESS, getKeyForNFT } from "../utils";

const ListItem = styled(Card)`
  position: relative;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const BALANCER_SWAP_ADDRESS = 'https://balancer.exchange/#/swap/';

const AuctionDisplay = ({ nftAssets, auction, selectAction, openSeaAssets }) => {
  let openSeaKey = getKeyForNFT(auction.nftContract, auction.nftId);
  console.log({openSeaKey: openSeaKey, auction: auction, openSeaAssets: openSeaAssets, exists: openSeaKey in openSeaAssets });

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

  const lastBidAmount = () => parseInt(auction.lastBid);

  const NFT_DISPLAY_SIZE = 80;

  let balancerButton = null;
  if (auction.balancerPool !== EMPTY_ADDRESS && auction.token != null) {
    let balancerAddress = BALANCER_SWAP_ADDRESS + auction.token;
    balancerButton =
      <Button mt={20} as="a" href={balancerAddress} target="\_blank" title="Learn more">
        Open Balancer Pool
      </Button>;
  }

  return (
      <ListItem>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={10}>
              <div style={{ width: NFT_DISPLAY_SIZE, height: NFT_DISPLAY_SIZE, boxShadow: "0px 0px 10px #888888" }}>
                <Avatar
                  size={NFT_DISPLAY_SIZE+"px"}
                  src={nftImageURL}
                />
              </div>
              <Heading as={"h1"} pl={20}>
                {nftName}
              </Heading>
            </Flex>
              <Text color={theme.colors.grey}>{timerDisplay}</Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Button mb={20} onClick={selectAction}>Go To Auction</Button>
            <Text color={theme.colors.grey}>Current bid: {lastBidAmount()}</Text>
            {balancerButton}
          </Flex>
        </Flex>
      </ListItem>
  );
};

AuctionDisplay.propTypes = {
  nftAssets: PropTypes.array,
  auction: PropTypes.any,
  selectAction: PropTypes.func,
  openSeaAssets: PropTypes.object,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
