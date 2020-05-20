import React from "react";
import styled from "styled-components";
import { Avatar, Button, Text, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { theme } from "rimble-ui";

// utils
import { getTimeRemainingDisplay, TimeGranularity } from "../utils";

const ListItem = styled(Card)`
  position: relative;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const AuctionDisplay = ({ nftAssets, auction, selectAction }) => {
  const getNFTName = () => "Kitties 98524";
  const getNFTImageURL = () =>
    "https://lh3.googleusercontent.com/gy4fPlhB0TJMk228L8mroeCgQxweAE6TCxIVqQ59CychrK4yGZkA98pCEs0INh9xmcpOMf5YMhiR2Vsw2eqMs0_Gkg";

  const getAuctionEndTimestampMS = () =>
    (parseInt(auction.frackTime) + parseInt(auction.auctionDuration)) * 1000;
  const timeRemaining = Math.max(getAuctionEndTimestampMS() - +new Date(), 0);

  let timerDisplay = timeRemaining === 0
    ? "Auction is over."
    : "Ends in " + getTimeRemainingDisplay(timeRemaining, TimeGranularity.MINUTES);

  const lastBidAmount = () => parseInt(auction.lastBid);

  const NFT_DISPLAY_SIZE = 80;

  return (
      <ListItem>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={10}>
              <div style={{ width: NFT_DISPLAY_SIZE, height: NFT_DISPLAY_SIZE, boxShadow: "0px 0px 10px #888888" }}>
                <Avatar
                  size={NFT_DISPLAY_SIZE+"px"}
                  src={getNFTImageURL()}
                />
              </div>
              <Heading as={"h1"} pl={20}>
                {getNFTName()}
              </Heading>
            </Flex>
              <Text color={theme.colors.grey}>{timerDisplay}</Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Button mb={20} onClick={selectAction}>Go To Auction</Button>
            <Text color={theme.colors.grey}>Current bid: {lastBidAmount()}</Text>
          </Flex>
        </Flex>
      </ListItem>
  );
};

AuctionDisplay.propTypes = {
  nftAssets: PropTypes.array,
  auction: PropTypes.any,
  selectAction: PropTypes.func,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
