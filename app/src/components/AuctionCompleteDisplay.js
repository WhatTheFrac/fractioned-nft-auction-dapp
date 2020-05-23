import React from "react";
import { Button, Card, Flex, Heading, Text } from "rimble-ui";
import PropTypes from "prop-types";

// utils
import { AuctionState, parseTokenAmount } from '../utils';
import { theme } from "rimble-ui";


const AuctionCompleteDisplay = ({
  auctionState,
  currentBid,
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
          {parseTokenAmount(currentBid)}
        </Heading>
        <Text>DAI</Text>
      </Flex>
      {auctionState === AuctionState.WON_NFT && (
        <Flex mt={20}>
          <Button onClick={() => {}} style={{ flex: 0.5 }} mr={16}>
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
          <Button onClick={() => {}} style={{ flex: 0.5 }} mr={16}>
            Claim your DAI
          </Button>
          <Text fontSize={1} style={{ flex: 0.5 }} color={theme.colors.grey}>
            Claim your share of the winning bid! You will receive your portion
            of the DAI immediately after claiming it.
          </Text>
        </Flex>
      )}
    </Card>
  );
};

AuctionCompleteDisplay.propTypes = {
  auctionState: PropTypes.string.isRequired,
  currentBid: PropTypes.number.isRequired,
};

export default AuctionCompleteDisplay;
