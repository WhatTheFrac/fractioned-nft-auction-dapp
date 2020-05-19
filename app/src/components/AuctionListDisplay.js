import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Button, Card, Flex, Heading, Text } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuctionDisplay from "./AuctionDisplay";
import AuctionListDisplayRow from "./AuctionListDisplayRow";

// utils
import { AuctionState } from "../utils";

const AuctionListDisplay = ({ nftAssets }) => {
  const [selectedAuctionAddress, setSelectedAuctionAddress] = useState('');

  const onClickAuction = (auctionAddress) => {
    setSelectedAuctionAddress(auctionAddress);
  }
  const unselectAuction = () => setSelectedAuctionAddress('');


  if (selectedAuctionAddress !== "") {
    return (
      <>
        <Button.Outline
          style={{ width: "100px" }}
          onClick={unselectAuction}
          mb={20}>
          {"< Go Back"}
        </Button.Outline>
        <AuctionDisplay auctionAddress={selectedAuctionAddress} />
      </>
    )
  }

  let auctions = [];
  for (let i = 0; i < 10; i++) {
    auctions.push(
      <AuctionListDisplayRow
        selectAction={() => onClickAuction("fake auction address" + i)}
        auctionAddress={i.toString()}
      />
    )
  }
  return (
    <>
      {auctions}
    </>
  );
};

AuctionListDisplay.propTypes = {
  nftAssets: PropTypes.array,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionListDisplay);
