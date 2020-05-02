import React, { useState } from 'react';
import { Flex, Loader, Text, Card, Button, Modal, Box, Heading, Link, Icon} from 'rimble-ui';
import { connect } from 'react-redux';
import { Eth } from '@rimble/icons';

import FractionateModalInfoRow from './FractionateModalInfoRow';
import FractionateProgressBar from './FractionateProgressBar';

const FractionateButton = (props) => {
  const { } = props;

  const resetState = () => {
    setShowMetamaskConfirm(false);
    setTransactionInProgress(false);
  }

  const closeModal = e => {
    e.preventDefault();
    resetState();
    setIsOpen(false);
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
        -> showMetamaskConfirm(true)
    3. user confirms with metamask
      -> metamaskConfirm()
        -> showMetamaskConfirm(false) showProgressBar(true)
      -> transactionComplete()
        -> success dialog shows [this modal replaced by success modal]
    4. user closes dialog

    TODO handle failure
  */
  const [isOpen, setIsOpen] = useState(false);
  const [showMetamaskConfirm, setShowMetamaskConfirm] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const userFractionateConfirm = e => {
    e.preventDefault();
    setShowMetamaskConfirm(true);
    // try to execute transaction, request permission with metamask
  };

  // TODO call this hook when the user actually does confirm with metamask instead of onclick below
  const metamaskConfirm = e => {
    e.preventDefault();
    setShowMetamaskConfirm(false);
    setTransactionInProgress(true);

    // TODO take actual fractionate action
  };

  let metamaskConfirmIndicator = (
    <Flex
      p={3}
      borderBottom={"1px solid gray"}
      borderColor={"moon-gray"}
      alignItems={"center"}
      flexDirection={["column", "row"]}
      onClick={metamaskConfirm}
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

  let header = transactionInProgress
    ? <FractionateProgressBar estimatedTimeInSeconds={30} />
    : <Box bg={"primary"} px={3} py={2}>
        <Text color={"white"}>Summary of Fractionate</Text>
      </Box>;

  return (
    <>
      <Button onClick={openModal}>Fractionate</Button>
      <Modal isOpen={isOpen}>
        <Card borderRadius={1} p={0} width={600}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="near-white"
            p={[3, 4]}
          >
            <Eth color="primary" size="40" />
            <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
              Confirm your purchase in [wallet]
            </Heading>
            <Link onClick={closeModal}>
              <Icon name="Close" color="moon-gray" aria-label="Close" />
            </Link>
          </Flex>
          <Box p={[3, 4]}>
            <Flex justifyContent={"space-between"} flexDirection={"column"}>
              <Text textAlign="center">
                Double check the details here – this can't be undone!
              </Text>
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
                {header}
                {showMetamaskConfirm ? metamaskConfirmIndicator : null}
                <FractionateModalInfoRow
                  title="Price"
                  data="5.4 Eth"
                  secondaryData="$1450 USD"
                />
                <FractionateModalInfoRow
                  title="Transaction Fee"
                  description="Pays the Ethereum network to process your transaction. Spent even if the transaction fails."
                  data="0.02 Eth"
                  secondaryData="$0.18"
                />
                <FractionateModalInfoRow
                  title="Estimated Time"
                  description="Commiting changes to the blockchain requires your transaction to be mined."
                  data="2 minutes"
                />
              </Flex>
              <Flex justifyContent="flex-end">
                <Button.Outline onClick={closeModal} mr={1}>Cancel</Button.Outline>
                <Button onClick={userFractionateConfirm}>Fractionate!</Button>
              </Flex>
            </Flex>
          </Box>
        </Card>
      </Modal>
    </>
  );
};

FractionateButton.propTypes = {
  // TODO
};

const mapStateToProps = ({
  wallet: { connected: { address: connectedWalletAddress } },
}) => ({
  connectedWalletAddress,
});

export default connect(mapStateToProps)(FractionateButton);
