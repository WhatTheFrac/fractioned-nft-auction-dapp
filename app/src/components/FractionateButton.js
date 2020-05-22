import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Card, Button, Modal, Box, Heading, Link, Icon } from 'rimble-ui';
import { Eth } from '@rimble/icons';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import moment from 'moment';

// actions
import { fractionateTransactionAction, resetFractionateTransactionAction } from '../actions/transactionActions';

// constants
import {
  STATUS_CONFIRMED,
  STATUS_PENDING,
  TRANSACTION_TYPE,
} from '../constants/transactionConstants';

// components
import FractionateModalInfoRow from './FractionateModalInfoRow';
import FractionateSuccessDialog from './FractionateSuccessDialog';
import FractionateFailureDialog from './FractionateFailureDialog';

// utils
import {
  createTokenSymbol,
  getTransactionDetailsLink,
  isCaseInsensitiveEqual,
  ExplanationString,
} from '../utils';


const FractionateButton = ({
  buttonProps,
  fractionateTransaction,
  connectedWalletAddress,
  transactions,
  waitingForTransactionSubmit,
  networkId,
  selectedNft,
  nftTokenSupplyAmount,
  nftTokenSellAmount,
  nftEstimatedValue,
  minBid,
  minBidIncrease,
  auctionDurationSeconds,
  onSuccess,
  resetFractionateTransaction,
}) => {
  const transaction = transactions.find(
    ({ type, from }) => type === TRANSACTION_TYPE.FRACTIONATE
      && isCaseInsensitiveEqual(from, connectedWalletAddress)
  ) || {};
  const transactionInProgress = transaction.status === STATUS_PENDING;

  const closeModal = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  /*
    HANDLING TRANSACTION AND VISUAL STATE
    1. dialog opened
    2. user clicks fractionate
      -> userFractionateConfirm()
    3. user confirms with metamask
      -> transactionSuccess()
      -> success dialog shows [this modal replaced by success modal]
    4. user closes dialog
    TODO handle failure
  */
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false);

  useEffect(() => {
    if (transaction.status === STATUS_CONFIRMED){
      setShowSuccessDialog(true);
      resetFractionateTransaction();
      setIsOpen(false);
      if (onSuccess) onSuccess(true);
    }
  }, [transactions])

  const userFractionateConfirm = (e) => {
    e.preventDefault();
    const { tokenAddress, tokenId, title } = selectedNft;
    fractionateTransaction(
      tokenAddress,
      tokenId,
      title,
      nftTokenSupplyAmount,
      nftTokenSellAmount,
      nftEstimatedValue,
      minBid,
      minBidIncrease,
      auctionDurationSeconds,
    );
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  // TODO call this when the transaction actually fails
  // const openFailureDialog = e => {
  //   e.preventDefault();
  //   setShowFailureDialog(true);
  //   closeModal(e);
  // };

  const closeFailureDialog = () => {
    setShowFailureDialog(false);
  };

  let metamaskConfirmIndicator = (
    <Flex
      p={3}
      borderBottom={"1px solid gray"}
      borderColor={"moon-gray"}
      alignItems={"center"}
      flexDirection={["column", "row"]}
    >
      <Box
        position={"relative"}
        height={"2em"}
        width={"2em"}
        mr={[0, 3]}
        mb={[3, 0]}
      >
        <Box position={"absolute"} top={"0"} left={"0"}>
          <Loader size={"2em"} />
        </Box>
      </Box>
      <Box>
        <Text
          textAlign={["center", "left"]}
          fontWeight={"600"}
          fontSize={1}
          lineHeight={"1.25em"}
        >
          Waiting for confirmation...
        </Text>
        <Link fontWeight={100} lineHeight={"1.25em"} color={"primary"}>
          Don't see the MetaMask popup?
        </Link>
      </Box>
    </Flex>
  );

  const { tokenAddress, title: nftTitle } = selectedNft;
  const putForSale = nftTokenSellAmount !== 0;
  const durationDisplayValue = `${moment.duration(auctionDurationSeconds, 'seconds').days()} day(s)`;
  const durationDeadlineDisplayValue = `Auction will end on ${moment().add('seconds', auctionDurationSeconds).format('YYYY-MM-DD [at] HH:mm')}`;
  const fractionateButtonTitle = transactionInProgress ? 'View pending transaction' : 'Fractionate';

  return (
    <>
      <Button onClick={openModal} {...buttonProps || []}>{fractionateButtonTitle}</Button>
      {!isEmpty(selectedNft) && (
        <Modal isOpen={isOpen}>
          <Card borderRadius={1} p={0} width={600}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              borderBottom={1}
              borderColor="near-white"
              p={[3, 4]}
            >
              <Flex>
                <Eth color="primary" size="40" />
              </Flex>
              <Flex>
                <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                  Fractionate Transaction
                </Heading>
              </Flex>
              <Link onClick={closeModal}>
                <Icon name="Close" color="moon-gray" aria-label="Close" />
              </Link>
            </Flex>
            <Box p={[3, 4]}>
              <Flex justifyContent={"space-between"} flexDirection={"column"}>
                {isEmpty(transaction) && (
                  <Text textAlign="center">
                    Please look over the details of your Fractionalization – this can't be undone!
                  </Text>
                )}
                <Flex
                  alignItems={"stretch"}
                  flexDirection={"column"}
                  borderRadius={2}
                  borderColor={"moon-gray"}
                  borderWidth={1}
                  borderStyle={"solid"}
                  overflow={"hidden"}
                  my={[3, 4]}
                >
                  {waitingForTransactionSubmit && metamaskConfirmIndicator}
                  {!isEmpty(transaction) && (
                    <Flex
                      bg="primary"
                      p={3}
                      borderBottom={"1px solid gray"}
                      borderColor={"moon-gray"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      flexDirection={["column", "row"]}
                    >
                      <Box>
                        <Text
                          textAlign={["center", "left"]}
                          color="near-white"
                          my={[1, 0]}
                          fontSize={3}
                          lineHeight={"1.25em"}
                        >
                          {transaction.status === STATUS_PENDING ? 'Waiting for confirmation...' : 'Transaction confirmed'}
                        </Text>
                      </Box>
                      <Box>
                        <Flex flexDirection="row" alignItems="center">
                          <Link
                            color="near-white"
                            ml={[0, 3]}
                            fontSize={1}
                            lineHeight={"1.25em"}
                            target="_blank"
                            href={getTransactionDetailsLink(transaction.hash, networkId)}
                          >
                            Transaction details
                            <Icon
                              ml={1}
                              color="near-white"
                              name="Launch"
                              size="14px"
                            />
                          </Link>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                  <FractionateModalInfoRow
                    title="NFT to deposit"
                    description={ExplanationString.depositNftExplanation}
                    data={nftTitle}
                    secondaryData={tokenAddress}
                  />
                  <FractionateModalInfoRow
                    title="Number of NFT shares to receive"
                    description={ExplanationString.mintFractionExplanation}
                    data={`${nftTokenSupplyAmount} shares`}
                    secondaryData={`of ${createTokenSymbol(nftTitle)} (${nftTitle})`}
                  />
                  {putForSale && (
                    <FractionateModalInfoRow
                      title="Number of NFT shares to sell"
                      description="This is the number of shares that will be put on sale in the Balancer pool."
                      data={`${nftTokenSellAmount} shares`}
                      secondaryData={`${100 * nftTokenSellAmount / nftTokenSupplyAmount}% of ${nftTokenSupplyAmount}`}
                    />
                  )}
                  {putForSale && (
                    <FractionateModalInfoRow
                      title="DAI to deposit"
                      description="In order for people to purchase fractions of this NFT, this DAI will be sent to the balancer pool along with the NFT tokens."
                      data={`${Number((nftEstimatedValue * 0.02).toFixed(18))} DAI`}
                      secondaryData={`2% of token worth`}
                    />
                  )}
                  <FractionateModalInfoRow
                    title="Auction Bid Settings"
                    description={ExplanationString.auctionExplanation}
                    data={`Min bid is ${Number(minBid.toFixed(18))} DAI`}
                    secondaryData={`Min bid increase: ${minBidIncrease}%`}
                  />
                  <FractionateModalInfoRow
                    title="Auction duration"
                    description={ExplanationString.auctionDurationExplanation}
                    data={durationDisplayValue}
                    secondaryData={durationDeadlineDisplayValue}
                  />
                  {/*<FractionateModalInfoRow*/}
                  {/*  title="Transaction Fee"*/}
                  {/*  description="Pays the Ethereum network to process your transaction. Spent even if the transaction fails."*/}
                  {/*  data="0.02 Eth"*/}
                  {/*  secondaryData="$0.18"*/}
                  {/*/>*/}
                  {/*<FractionateModalInfoRow*/}
                  {/*  title="Estimated Time"*/}
                  {/*  description="Commiting changes to the blockchain requires time for your transaction to be mined."*/}
                  {/*  data={estimatedTimeForDisplay()}*/}
                  {/*/>*/}
                </Flex>
                <Flex justifyContent="flex-end">
                  <Button.Outline onClick={closeModal} mr={1}>Close</Button.Outline>
                  {isEmpty(transaction) && (
                    <Button
                      onClick={userFractionateConfirm}
                      disabled={!!transactionInProgress}
                    >
                      Fractionate
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          </Card>
        </Modal>
      )}
      <FractionateSuccessDialog isOpen={showSuccessDialog} closeHook={closeSuccessDialog} />
      <FractionateFailureDialog isOpen={showFailureDialog} closeHook={closeFailureDialog} />
    </>
  );
};

FractionateButton.propTypes = {
  buttonProps: PropTypes.object,
  fractionateTransaction: PropTypes.func,
  transactions: PropTypes.array,
  connectedWalletAddress: PropTypes.string,
  waitingForTransactionSubmit: PropTypes.bool,
  networkId: PropTypes.number,
  selectedNft: PropTypes.object,
  nftTokenSupplyAmount: PropTypes.number,
  nftTokenSellAmount: PropTypes.number,
  nftEstimatedValue: PropTypes.number,
  minBid: PropTypes.number,
  minBidIncrease: PropTypes.number,
  auctionDurationSeconds: PropTypes.number,
  onSuccess: PropTypes.func,
  resetFractionateTransaction: PropTypes.func,
};

const mapStateToProps = ({
  transactions: {
    data: transactions,
    waitingForSubmit: waitingForTransactionSubmit,
  },
  wallet: {
    connected: {
      networkId,
      address: connectedWalletAddress,
    },
  },
}) => ({
  transactions,
  connectedWalletAddress,
  waitingForTransactionSubmit,
  networkId,
});

const mapDispatchToProps = {
  fractionateTransaction: fractionateTransactionAction,
  resetFractionateTransaction: resetFractionateTransactionAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FractionateButton);
