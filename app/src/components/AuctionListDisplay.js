import React, { useState } from "react";
import { Button } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionDisplay from "./AuctionDisplay";
import AuctionListDisplayRow from "./AuctionListDisplayRow";

const NO_AUCTION = -1;

const AuctionListDisplay = ({ nftAssets, allFracExisting }) => {
  const [selectedAuctionID, setSelectedAuctionID] = useState(NO_AUCTION);

  const onClickAuction = (id) => setSelectedAuctionID(id);
  const unselectAuction = () => setSelectedAuctionID(NO_AUCTION);

  if (selectedAuctionID !== NO_AUCTION) {
    return (
      <>
        <Button.Outline
          style={{ width: "100px" }}
          onClick={unselectAuction}
          mb={20}>
          {"< Go Back"}
        </Button.Outline>
        <AuctionDisplay auction={allFracExisting[selectedAuctionID]} />
      </>
    )
  }

  let auctions = allFracExisting.map((auction, key) =>
    <AuctionListDisplayRow
      key={key}
      selectAction={() => onClickAuction(key)}
      auction={auction}
      nftAssets={nftAssets}
    />
  );

  return (
    <>
      {auctions}
    </>
  );
};

AuctionListDisplay.propTypes = {
  nftAssets: PropTypes.array,
  allFracExisting: PropTypes.any.isRequired,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionListDisplay);
