import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Card, Button, Modal, Box, Heading, Link, Icon } from 'rimble-ui';
import { Eth } from '@rimble/icons';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

// actions
import { approveTokenTransactionAction } from '../actions/transactionActions';

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
  getTransactionDetailsLink,
  isCaseInsensitiveEqual,
} from '../utils';


const FractionateButton = ({
  buttonProps,
  approveTokenTransaction,
  connectedWalletAddress,
  transactions,
  waitingForTransactionSubmit,
  networkId,
  selectedNft,
  nftTokenAmount,
}) => {
  // TODO const { } = props;

  const resetState = () => {
  }

  const closeModal = e => {
    e.preventDefault();
    resetState();
    setIsOpen(false);
    // TODO cancel in progress transaction if there is one in progress
  };

  const openModal = e => {
    e.preventDefault();
    resetState();
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


  // TODO: change to fractionalize transaction type
  const fractionateTransaction = transactions.find(
    ({ type, from }) => type === TRANSACTION_TYPE.TOKEN_APPROVE
      && isCaseInsensitiveEqual(from, connectedWalletAddress)
  ) || {};
  const transactionInProgress = fractionateTransaction.status === STATUS_PENDING;

  useEffect(() => {
    if (fractionateTransaction.status === STATUS_CONFIRMED) setShowSuccessDialog(true);
  }, [transactions])


  const userFractionateConfirm = (e) => {
    e.preventDefault();
    // TODO: change to fractionalize transaction action with its param
    approveTokenTransaction();
  };

  // TODO call this when the transaction actually succeeds
  const openSuccessDialog = (e) => {
    e.preventDefault();
    setShowSuccessDialog(true);
    closeModal(e);
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  // TODO call this when the transaction actually fails
  const openFailureDialog = e => {
    e.preventDefault();
    resetState();
    setShowFailureDialog(true);
    closeModal(e);
  };

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

  return (
    <>
      <Button onClick={openModal} {...buttonProps || []}>Fractionate</Button>
      <Modal isOpen={isOpen}>
        <Card borderRadius={1} p={0} width={600}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="near-white"
            p={[3, 4]}
          >
            <Flex onClick={openSuccessDialog}>
              <Eth color="primary" size="40" />
            </Flex>
            <Flex onClick={openFailureDialog}>
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
              {isEmpty(fractionateTransaction) && (
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
                {!isEmpty(fractionateTransaction) && (
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
                        {fractionateTransaction.status === STATUS_PENDING ? 'Waiting for confirmation...' : 'Transaction confirmed'}
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
                          href={getTransactionDetailsLink(fractionateTransaction.hash, networkId)}
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
                  description="This is the NFT for which this protocol will create fractional shares."
                  data={nftTitle}
                  secondaryData={tokenAddress}
                />
                <FractionateModalInfoRow
                  title="Number of NFT shares to receive"
                  description="This is the number of shares that will be created for your NFT."
                  data={`${nftTokenAmount} shares`}
                  secondaryData={`of ${nftTitle}`}
                />
                {/*<FractionateModalInfoRow*/}
                {/*  title="DAI to deposit"*/}
                {/*  description="In order for people to purchase fractions of this NFT, this DAI will be sent to the balancer pool along with the NFT tokens."*/}
                {/*  data="1,000 DAI"*/}
                {/*  secondaryData="approximately $1,000"*/}
                {/*/>*/}
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
                {isEmpty(fractionateTransaction) && (
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
      <FractionateSuccessDialog isOpen={showSuccessDialog} closeHook={closeSuccessDialog} />
      <FractionateFailureDialog isOpen={showFailureDialog} closeHook={closeFailureDialog} />
    </>
  );
};

FractionateButton.propTypes = {
  buttonProps: PropTypes.object,
  approveTokenTransaction: PropTypes.func,
  transactions: PropTypes.array,
  connectedWalletAddress: PropTypes.string,
  waitingForTransactionSubmit: PropTypes.bool,
  networkId: PropTypes.number,
  selectedNft: PropTypes.object,
  nftTokenAmount: PropTypes.number,
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
  approveTokenTransaction: approveTokenTransactionAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FractionateButton);
