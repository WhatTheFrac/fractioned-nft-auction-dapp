import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionDisplay from "./AuctionDisplay";
import AuctionListDisplayRow from "./AuctionListDisplayRow";

import { fetchCollectibleByTokenData } from '../actions/walletActions';

const NO_AUCTION = -1;

const AuctionListDisplay = ({ nftAssets, allFracExisting, connectedWalletAddress, loadOpensea, openSeaAssets }) => {
  const [selectedAuctionID, setSelectedAuctionID] = useState(NO_AUCTION);

  const onClickAuction = (id) => setSelectedAuctionID(id);
  const unselectAuction = () => setSelectedAuctionID(NO_AUCTION);

  useEffect(() => {
    allFracExisting.forEach((item) => {
      loadOpensea(item.nftContract, item.nftId)
    });
  }, [allFracExisting]);

  if (selectedAuctionID !== NO_AUCTION) {
    return (
      <>
        <Button.Outline
          style={{ width: "100px" }}
          onClick={unselectAuction}
          mb={20}>
          {"< Go Back"}
        </Button.Outline>
        <AuctionDisplay
          auction={allFracExisting[selectedAuctionID]}
          connectedWalletAddress={connectedWalletAddress}
          openSeaAssets={openSeaAssets}
        />
      </>
    )
  }

  let auctions = allFracExisting.map((auction, key) =>
    <AuctionListDisplayRow
      key={key}
      selectAction={() => onClickAuction(key)}
      auction={auction}
      nftAssets={nftAssets}
      openSeaAssets={openSeaAssets}
    />
  );

  return <>{auctions}</>;
};

AuctionListDisplay.propTypes = {
  nftAssets: PropTypes.array,
  allFracExisting: PropTypes.any.isRequired,
  transactions: PropTypes.array,
  balances: PropTypes.arrayOf(PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.number,
  })),
  connectedWalletAddress: PropTypes.string,
  networkId: PropTypes.number,
  approveTokenTransaction: PropTypes.func,
  loadOpensea: PropTypes.func.isRequired,
  openSeaAssets: PropTypes.object,
};

const mapStateToProps = ({
  wallet: {
    nftAssets,
    balances,
    openSeaAssets,
    connected: { address: connectedWalletAddress, networkId },
  },
  transactions: { data: transactions },
}) => ({
  nftAssets,
  balances,
  transactions,
  connectedWalletAddress,
  networkId,
  openSeaAssets,
});

const mapDispatchToProps = {
  loadOpensea: fetchCollectibleByTokenData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuctionListDisplay);
