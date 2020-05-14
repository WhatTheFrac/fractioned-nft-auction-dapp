import React from "react";
import styled from "styled-components";
import { Button, Card, Flex, Heading, Text } from "rimble-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// utils
import { AuctionState } from "../utils";
import { theme } from "rimble-ui";

const hr = styled.span`
  display: block;
  width: 100%;
  border-top: 1px solid red;
`;

const AuctionCompleteDisplay = ({
  auctionState,
  currentBid,
  handleClaimNFT,
  handleClaimWinnings,
}) => {
  return (
    <Card mt={20} backgroundColor={theme.colors.primary}>
      <Text textAlign="center">The auction is Complete!</Text>
      <hr />
      <Flex
        flexDirection="row"
        mt={12}
        alignItems="center"
        justifyContent="center"
      >
        <Heading as={"h3"} color={theme.colors.primary}>
          Sold for
        </Heading>
        <Heading as={"h1"} px={8}>
          {currentBid}
        </Heading>
        <Text>Dai</Text>
      </Flex>
      {auctionState === AuctionState.WON_NFT && (
        <Flex mt={20}>
          <Button onClick={handleClaimNFT} style={{ flex: 0.5 }} mr={16}>
            Claim the NFT
          </Button>
          <Text fontSize={1} style={{ flex: 0.5 }} color={theme.colors.grey}>
            You won the auction! You will receive your token immediately after
            claiming it.
          </Text>
        </Flex>
      )}
      {auctionState === AuctionState.WON_PAYOUT && (
        <Flex mt={20}>
          <Button onClick={handleClaimNFT} style={{ flex: 0.5 }} mr={16}>
            Claim your Dai
          </Button>
          <Text fontSize={1} style={{ flex: 0.5 }} color={theme.colors.grey}>
            Claim your share of the winning bid! You will receive your portion
            of the Dai immediately after claiming it.
          </Text>
        </Flex>
      )}
    </Card>
  );
};

AuctionCompleteDisplay.propTypes = {
  auctionState: PropTypes.string.isRequired,
  currentBid: PropTypes.number.isRequired,
  handleClaimNFT: PropTypes.func.isRequired,
  handleClaimWinnings: PropTypes.func.isRequired,
};

const mapStateToProps = ({ wallet: { nftAssets } }) => ({
  nftAssets,
});

export default connect(mapStateToProps)(AuctionCompleteDisplay);
