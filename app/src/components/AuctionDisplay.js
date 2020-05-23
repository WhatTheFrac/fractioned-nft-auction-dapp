import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Image, Card, Flex, Heading } from "rimble-ui";
import PropTypes from "prop-types";

// components
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

const AuctionDisplay = ({
  auction,
  connectedWallet,
  openSeaAssets,
  transactions,
  balances,
  approveTokenTransaction,
  bidAuctionTransaction,
  getLoadAllFrac,
  settleAuctionTransaction,
}) => {
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
    return isExistingBids() ? connectedWallet.address === auction.lastBidder : false;

  }
  const isUserNFTWinner = () =>
    isAuctionComplete() ? connectedWallet.address === auction.lastBidder : false;

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

  const NFT_DISPLAY_SIZE = 100;

  return (
    <>
      <NFTHero>
        <Centered>
          <Flex flexDirection="row" alignItems="center">
            <div style={{ width: NFT_DISPLAY_SIZE, height: NFT_DISPLAY_SIZE, boxShadow: "0px 0px 10px #888888" }}>
              <Image
                height={NFT_DISPLAY_SIZE+"px"}
                width={NFT_DISPLAY_SIZE+"px"}
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
          bidAuctionTransaction={bidAuctionTransaction}
          currentBid={getCurrentBid()}
          minBid={getMinimumBid()}
          transactions={transactions}
          connectedWallet={connectedWallet}
          balances={balances}
          approveTokenTransaction={approveTokenTransaction}
          auctionId={auction.id}
          getLoadAllFrac={getLoadAllFrac}
        />
      )}
      {auctionIsComplete && (
        <AuctionCompleteDisplay
          auctionState={auctionState}
          currentBid={getCurrentBid()}
          auctionId={auction.id}
          transactions={transactions}
          settleAuctionTransaction={settleAuctionTransaction}
        />
      )}
    </>
  );
};

AuctionDisplay.propTypes = {
  auction: PropTypes.object,
  connectedWallet: PropTypes.object,
  openSeaAssets: PropTypes.object,
  transactions: PropTypes.array,
  balances: PropTypes.array,
  approveTokenTransaction: PropTypes.func,
  bidAuctionTransaction: PropTypes.func,
  getLoadAllFrac: PropTypes.func,
  settleAuctionTransaction: PropTypes.func,
};

export default AuctionDisplay;
