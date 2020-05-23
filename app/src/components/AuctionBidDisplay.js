import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Loader,
  Text,
} from 'rimble-ui';
import PropTypes from "prop-types";
import { Dai as DaiIcon } from '@rimble/icons';
import { theme } from "rimble-ui";

// utils
import {
  parseNumberInputValue,
  AuctionState,
  getTimeRemainingDisplay,
  TimeGranularity,
  parseTokenAmount,
  getTokenAllowance,
  getFrackerContractAddress,
  getDaiAddress,
} from '../utils';

// constants
import {
  STATUS_PENDING,
  TRANSACTION_TYPE,
} from '../constants/transactionConstants';


const AuctionBidDisplay = ({
  auctionState,
  endTime,
  timeRemaining,
  currentBid,
  minBid,
  connectedWallet,
  transactions,
  balances,
  approveTokenTransaction,
  bidAuctionTransaction,
  auctionId,
  getLoadAllFrac,
}) => {
  const [bid, setBid] = useState("");
  const [unlockedDaiAmount, setUnlockedDaiAmount] = useState(0);
  const [gettingDaiAllowance, setGettingDaiAllowance] = useState(false);
  const { address: connectedWalletAddress, networkId } = connectedWallet;

  useEffect(() => {
    getLoadAllFrac()
    if (gettingDaiAllowance) return;
    setGettingDaiAllowance(true);
    getTokenAllowance(
      connectedWalletAddress,
      getFrackerContractAddress(networkId),
      getDaiAddress(networkId),
      18,
    )
      .then(setUnlockedDaiAmount)
      .then(() => setGettingDaiAllowance(false));
  }, [transactions]);

  const minBidAmountDai = parseTokenAmount(minBid);
  const minimumBidDisplay = `> ${minBidAmountDai} DAI`;
  const bidAmountDai = Number(bid);
  const bidUnlocked = !!bidAmountDai && unlockedDaiAmount >= bidAmountDai;

  const daiAllowanceTransaction = transactions.find((transaction) => transaction.type === TRANSACTION_TYPE.FRACTIONATE_TOKEN_APPROVE) || {};
  const isDaiAllowanceTransactionPending = daiAllowanceTransaction.status === STATUS_PENDING;
  const { balance: daiBalance = 0 } = balances.find((balance) => balance.symbol === 'DAI') || {};
  const enoughDai = !!bidAmountDai && daiBalance >= bidAmountDai;
  const unlockDaiButtonDisabled = !enoughDai || bidUnlocked || gettingDaiAllowance || isDaiAllowanceTransactionPending;
  const unlockDaiButtonTitle = enoughDai || !bidAmountDai ? 'Unlock DAI' : 'Not enough DAI';

  const auctionBidTransaction = transactions.find((transaction) => transaction.type === TRANSACTION_TYPE.FRACTIONATE_AUCTION_BID) || {};
  const isAuctionBidTransactionPending = auctionBidTransaction.status === STATUS_PENDING;

  let timerDisplay = getTimeRemainingDisplay(timeRemaining, TimeGranularity.SECONDS);

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
                {parseTokenAmount(currentBid)}
              </Heading>
              <Text>DAI</Text>
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
              disabled={isAuctionBidTransactionPending}
              placeholder={minimumBidDisplay}
            />
          </Field>
          <Flex style={{ marginBottom: 16, flex: 1 }}>
            <Button.Outline
              style={{ flex: 1 }}
              disabled={unlockDaiButtonDisabled}
              onClick={() => approveTokenTransaction(bidAmountDai, getFrackerContractAddress(networkId))}
            >
              {(!!gettingDaiAllowance || isDaiAllowanceTransactionPending) && <Loader size={20} />}
              {!gettingDaiAllowance && !isDaiAllowanceTransactionPending && unlockDaiButtonTitle}
            </Button.Outline>
            <DaiIcon size={45} ml={3} />
          </Flex>
          <Flex
            style={{ flex: 0.6 }}
            height={80}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              style={{ flex: 1 }}
              ml={16}
              onClick={() => bidAuctionTransaction(auctionId, Number(bid))}
              disabled={!bidUnlocked || bidAmountDai <= minBidAmountDai || isAuctionBidTransactionPending}
            >
              {isAuctionBidTransactionPending ? 'Bid pending' : 'Place bid'}
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
  currentBid: PropTypes.number.isRequired,
  minBid: PropTypes.number.isRequired,
  connectedWallet: PropTypes.object,
  transactions: PropTypes.array,
  balances: PropTypes.array,
  approveTokenTransaction: PropTypes.func,
  bidAuctionTransaction: PropTypes.func,
  auctionId: PropTypes.string,
  getLoadAllFrac: PropTypes.func,
};

export default AuctionBidDisplay;
