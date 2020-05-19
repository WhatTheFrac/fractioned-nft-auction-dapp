import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionBidDisplay from "./AuctionBidDisplay";
import AuctionCompleteDisplay from "./AuctionCompleteDisplay";

// utils
import { AuctionState } from "../utils";

const NFTHero = styled(Card)`
  position: relative;
  height: 200px;
  border-radius: 12px;
  margin: 0 -1%;
`;

const Centered = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const AuctionDisplay = ({ nftAssets, auctionAddress }) => {
  // TODO implement these data/action functions
  const handleBidSubmit = (bid) => alert("Bid button clicked with bid: " + bid);
  const handleClaimNFT = () => alert("claim nft button clicked");
  const handleClaimWinnings = () => alert("claim winnings button clicked");
  const getCurrentBid = () => "359.43";
  const getMinimumBid = () => "382.89";
  const getAuctionEndTimestampMS = () => 1590080286692;
  const getNFTName = () => "Planet 239479";

  // TODO returns true if the auction is not complete AND the following is true for the user
  const isUserHighestBidder = () => false;
  const isExistingBids = () => getCurrentBid() > 0;

  // TODO returns true if the auction is complete AND the following is true for the user
  const isUserNFTWinner = () => false;
  const isUserReturnsWinner = () => false;

  const getTimeRemaining = () =>
    Math.max(getAuctionEndTimestampMS() - +new Date(), 0);
  const isAuctionComplete = () => getAuctionEndTimestampMS() - +new Date() < 0;

  const getAuctionState = () => {
    if (!isAuctionComplete()) {
      if (isUserHighestBidder()) return AuctionState.HIGHEST_BIDDER;
      if (isExistingBids()) return AuctionState.EXISTING_BIDS;
      return AuctionState.NO_BIDS;
    } else {
      if (isUserNFTWinner()) return AuctionState.WON_NFT;
      if (isUserReturnsWinner()) return AuctionState.WON_PAYOUT;
      return AuctionState.AUCTION_OVER;
    }
  };
  const [auctionState, setAuctionState] = useState(getAuctionState());
  const [auctionIsComplete, setAuctionIsComplete] = useState(
    isAuctionComplete()
  );
  const [timeRemaining, setTimeRemaining] = useState(isAuctionComplete());

  useEffect(() => {
    setTimeout(() => {
      setAuctionState(getAuctionState());
      setAuctionIsComplete(isAuctionComplete());
      setTimeRemaining(getTimeRemaining());
    }, 1000);
  });

  return (
    <>
      <NFTHero>
        <Centered>
          <Flex flexDirection="row" alignItems="center">
            <div style={{ width: 100, height: 100 }}>
              <Avatar
                size="100px"
                src="https://lh3.googleusercontent.com/gy4fPlhB0TJMk228L8mroeCgQxweAE6TCxIVqQ59CychrK4yGZkA98pCEs0INh9xmcpOMf5YMhiR2Vsw2eqMs0_Gkg"
              />
            </div>
            <Heading as={"h1"} pl={20}>
              {getNFTName()}
            </Heading>
          </Flex>
        </Centered>
      </NFTHero>
      {!auctionIsComplete && (
        <AuctionBidDisplay
          auctionState={auctionState}
          endTime={getAuctionEndTimestampMS()}
          timeRemaining={timeRemaining}
          handleBidSubmit={handleBidSubmit}
          currentBid={getCurrentBid()}
          minBid={getMinimumBid()}
        />
      )}
      {auctionIsComplete && (
        <AuctionCompleteDisplay
          auctionState={auctionState}
          currentBid={getCurrentBid()}
          handleClaimNFT={handleClaimNFT}
          handleClaimWinnings={handleClaimWinnings}
        />
      )}
    </>
  );
};

AuctionDisplay.propTypes = {
  nftAssets: PropTypes.array,
  auctionAddress: PropTypes.string,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
