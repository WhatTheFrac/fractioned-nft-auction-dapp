import React, { useState } from "react";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Text,
} from "rimble-ui";
import PropTypes from "prop-types";

// utils
import { parseNumberInputValue, AuctionState } from "../utils";
import { theme } from "rimble-ui";

const hr = styled.span`
  display: block;
  width: 100%;
  border-top: 1px solid red;
`;

const AuctionBidDisplay = ({
  auctionState,
  endTime,
  timeRemaining,
  handleBidSubmit,
  currentBid,
  minBid,
}) => {
  const [bid, setBid] = useState("");

  const minimumBidDisplay = "Minimum bid: " + minBid + " Dai";

  let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  let seconds = Math.floor((timeRemaining / 1000) % 60);
  let timeLeft =
    days > 0
      ? days === 1
        ? { day: days, hours: hours }
        : { days: days, hours: hours }
      : { hours: hours, minutes: minutes, seconds: seconds };

  let timerDisplay = "";
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) return;
    timerDisplay = timerDisplay.concat(
      " " + timeLeft[interval] + " " + interval
    );
  });

  let bidStatusText = null;
  switch(auctionState) {
    case AuctionState.HIGHEST_BIDDER:
      bidStatusText =
        <Text color={theme.colors.primary} mb={12}>
          Congrats, you hold the highest bid!
        </Text>;
      break;
    case AuctionState.NO_BIDS:
      bidStatusText =
        <Text color={theme.colors.primary} mb={12}>
          No bids yet, be the first to Bid!
        </Text>;
      break;
    default:
      bidStatusText =
        <Text color={theme.colors.grey} mb={12}>
          Current Bid:
        </Text>;
  }

  return (
    <Card mt={20}>
      <Text fontSize={1} color={theme.colors.grey}>
        Ends in <span style={{ color: "red" }}>{timerDisplay}</span> on{" "}
        {new Date(endTime).toGMTString()}
      </Text>
      <hr />
      <Flex mx={20} mt={20} flexDirection="column">
        {bidStatusText}
        {(auctionState === AuctionState.EXISTING_BIDS ||
          auctionState === AuctionState.HIGHEST_BIDDER) && (
          <>
            <Flex flexDirection="row" mb={12} alignItems="center">
              <Heading as={"h1"} pr={8}>
                {currentBid}
              </Heading>
              <Text>Dai</Text>
            </Flex>
          </>
        )}
        <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
          <Field
            color={theme.colors.grey}
            label="Your bid:"
            style={{ flex: 0.5 }}
            mr={16}
          >
            <Input
              type="text"
              required
              onChange={(event) =>
                setBid(parseNumberInputValue(event.target.value))
              }
              value={bid}
              width="100%"
              placeholder={minimumBidDisplay}
            />
          </Field>
          <Flex
            style={{ flex: 0.6 }}
            height={80}
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              size={50}
              src="https://airswap-token-images.s3.amazonaws.com/DAI.png"
            />
            <Button style={{ flex: 1 }} ml={16} onClick={() => handleBidSubmit(bid)}>
              Place bid
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

AuctionBidDisplay.propTypes = {
  auctionState: PropTypes.string.isRequired,
  endTime: PropTypes.number.isRequired,
  timeRemaining: PropTypes.number.isRequired,
  handleBidSubmit: PropTypes.func.isRequired,
  currentBid: PropTypes.number.isRequired,
  minBid: PropTypes.number.isRequired,
};

export default AuctionBidDisplay;
