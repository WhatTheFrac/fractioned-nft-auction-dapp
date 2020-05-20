import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionBidDisplay from "./AuctionBidDisplay";
import AuctionCompleteDisplay from "./AuctionCompleteDisplay";

// utils
import { AuctionState, EMPTY_ADDRESS } from "../utils";

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

const AuctionDisplay = ({ nftAssets, auction }) => {
  // TODO implement these data/action functions
  const handleBidSubmit = (bid) => alert("Bid button clicked with bid: " + bid);
  const handleClaimNFT = () => alert("claim nft button clicked");
  const handleClaimWinnings = () => alert("claim winnings button clicked");

  const getCurrentBid = () => parseInt(auction.lastBid);
  const getMinimumBid = () => {
    if (auction.lastBidder === EMPTY_ADDRESS) {
      return parseInt(auction.minAuctionBid);
    } else {
      return auction.lastBid * (1 + (parseInt(auction.minBidIncrease)/100))
    }
  }
  const getAuctionEndTimestampMS = () =>
    (parseInt(auction.frackTime) + parseInt(auction.auctionDuration) + 1000000) * 1000;
  const getTimeRemaining = () =>
    Math.max(getAuctionEndTimestampMS() - +new Date(), 0);
  const isAuctionComplete = () => getTimeRemaining() === 0;

  // TODO
  const getNFTName = () => "Planet 239479";
  // TODO returns true if the auction is not complete AND the following is true for the user
  const isExistingBids = () => getCurrentBid() > 0;
  const isUserHighestBidder = () => {
    return isExistingBids()
      ? false // TODO replace with actual logic with wallet public address
      : false;

  }
  // TODO returns true if the auction is complete AND the following is true for the user
  const isUserNFTWinner = () => {
    return isAuctionComplete()
      ? false // TODO replace with actual logic, just need the user's public address
      : false;
  }
  const isUserReturnsWinner = () =>  {
    return isAuctionComplete()
      ? false // TODO replace with actual logic, just need the user's public address
      : false;

  }

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
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

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
  auction: PropTypes.object,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
