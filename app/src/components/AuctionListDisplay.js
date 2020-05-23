import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import AuctionDisplay from "./AuctionDisplay";
import AuctionListDisplayRow from "./AuctionListDisplayRow";

// actions
import { fetchCollectibleByTokenData } from '../actions/walletActions';
import {
  approveTokenTransactionAction,
  bidAuctionTransactionAction,
  getLoadAllFracAction,
  settleAuctionTransactionAction,
} from '../actions/transactionActions';


const NO_AUCTION = -1;

const AuctionListDisplay = ({
  allFracExisting,
  connectedWallet,
  loadOpensea,
  openSeaAssets,
  transactions,
  balances,
  approveTokenTransaction,
  bidAuctionTransaction,
  getLoadAllFrac,
  settleAuctionTransaction,
}) => {
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
          connectedWallet={connectedWallet}
          openSeaAssets={openSeaAssets}
          transactions={transactions}
          balances={balances}
          approveTokenTransaction={approveTokenTransaction}
          bidAuctionTransaction={bidAuctionTransaction}
          getLoadAllFrac={getLoadAllFrac}
          settleAuctionTransaction={settleAuctionTransaction}
        />
      </>
    )
  }

  let auctions = allFracExisting.map((auction, key) =>
    <AuctionListDisplayRow
      key={key}
      selectAction={() => onClickAuction(key)}
      auction={auction}
      openSeaAssets={openSeaAssets}
    />
  );

  return <>{auctions}</>;
};

AuctionListDisplay.propTypes = {
  allFracExisting: PropTypes.any.isRequired,
  transactions: PropTypes.array,
  balances: PropTypes.arrayOf(PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.number,
  })),
  connectedWallet: PropTypes.object,
  approveTokenTransaction: PropTypes.func,
  loadOpensea: PropTypes.func.isRequired,
  openSeaAssets: PropTypes.object,
};

const mapStateToProps = ({
  wallet: {
    balances,
    openSeaAssets,
    connected: connectedWallet,
  },
  transactions: { data: transactions },
}) => ({
  balances,
  transactions,
  connectedWallet,
  openSeaAssets,
});

const mapDispatchToProps = {
  loadOpensea: fetchCollectibleByTokenData,
  approveTokenTransaction: approveTokenTransactionAction,
  bidAuctionTransaction: bidAuctionTransactionAction,
  getLoadAllFrac: getLoadAllFracAction,
  settleAuctionTransaction: settleAuctionTransactionAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuctionListDisplay);
