import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionBidDisplay from "./AuctionBidDisplay";
import AuctionCompleteDisplay from "./AuctionCompleteDisplay";

// utils
import { AuctionState, EMPTY_ADDRESS, getKeyForNFT } from "../utils";

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

const AuctionDisplay = ({ nftAssets, auction, connectedWalletAddress, openSeaAssets }) => {
  // TODO implement these data/action functions <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,
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
    (parseInt(auction.frackTime) + parseInt(auction.auctionDuration)) * 1000;
  const getTimeRemaining = () =>
    Math.max(getAuctionEndTimestampMS() - +new Date(), 0);
  const isAuctionComplete = () => getTimeRemaining() === 0;

  let openSeaKey = getKeyForNFT(auction.nftContract, auction.nftId);

  const getNFTName = () => openSeaAssets[openSeaKey].name;
  const getNFTImageURL = () => openSeaAssets[openSeaKey].image_url;

  const isExistingBids = () => getCurrentBid() > 0;
  const isUserHighestBidder = () => {
    return isExistingBids() ? connectedWalletAddress === auction.lastBidder : false;

  }
  const isUserNFTWinner = () =>
    isAuctionComplete() ? connectedWalletAddress === auction.lastBidder : false;

  // TODO replace with actual logic <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // needs to detect if the user has the fractional token in their wallet
  const isUserReturnsWinner = () =>  {
    return isAuctionComplete()
      ? false
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
                src={getNFTImageURL()}
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
  connectedWalletAddress: PropTypes.string,
  openSeaAssets: PropTypes.object,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionDisplay);
