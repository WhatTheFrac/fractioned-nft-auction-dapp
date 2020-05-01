import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Avatar, Card, Button, Modal, Box, Heading, Image, Link, Icon, Tooltip} from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Eth } from '@rimble/icons';

// utils
import { getTokenBalance } from '../utils';
import FractionateModalInfoRow from './FractionateModalInfoRow';

const FractionateButton = (props) => {
  const {
  } = props;

  const [balance, setBalance] = useState(0);
  const [isFetchingTokenBalance, setIsFetchingTokenBalance] = useState(true)


  const [isOpen, setIsOpen] = useState(false);

  const closeModal = e => {
    e.preventDefault();
    setIsOpen(false);
  };

  const openModal = e => {
    e.preventDefault();
    setIsOpen(true);
  };

  const fractionate = e => {
    // TODO replace with the actual fractionate action
    e.preventDefault();
    setIsOpen(false);
  };

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
                <Box bg={"primary"} px={3} py={2}>
                  <Text color={"white"}>Summary of Fractionate</Text>
                </Box>
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
                <Flex
                  justifyContent={"space-between"}
                  bg="near-white"
                  py={[2, 3]}
                  px={3}
                  alignItems={"center"}
                  borderBottom={"1px solid gray"}
                  borderColor={"moon-gray"}
                  flexDirection={["column", "row"]}
                >
                  <Text
                    textAlign={["center", "left"]}
                    color="near-black"
                    fontWeight="bold"
                  >
                    Price
                  </Text>
                  <Flex
                    alignItems={["center", "flex-end"]}
                    flexDirection={["row", "column"]}
                  >
                    <Text
                      mr={[2, 0]}
                      color="near-black"
                      fontWeight="bold"
                      lineHeight={"1em"}
                    >
                      5.4 ETH
                    </Text>
                    <Text color="mid-gray" fontSize={1}>
                      $1450 USD
                    </Text>
                  </Flex>
                </Flex>
                <FractionateModalInfoRow
                  title="Transaction Fee 2"
                  description="Pays the Ethereum network to process your transaction. Spent even if the transaction fails."
                  data="data2"
                  secondaryData="secondayr data"
                />
                <Flex
                  justifyContent={"space-between"}
                  bg="light-gray"
                  py={[2, 3]}
                  px={3}
                  alignItems={"center"}
                  borderBottom={"1px solid gray"}
                  borderColor={"moon-gray"}
                  flexDirection={["column", "row"]}
                >
                  <Flex alignItems={"center"}>
                    <Text
                      textAlign={["center", "left"]}
                      color="near-black"
                      fontWeight="bold"
                    >
                      Transaction fee
                    </Text>
                    <Tooltip
                      message="Pays the Ethereum network to process your transaction. Spent even if the transaction fails."
                      position="top"
                    >
                      <Icon
                        ml={1}
                        name={"InfoOutline"}
                        size={"14px"}
                        color={"primary"}
                      />
                    </Tooltip>

                  </Flex>
                  <Flex
                    alignItems={["center", "flex-end"]}
                    flexDirection={["row", "column"]}
                  >
                    <Text
                      mr={[2, 0]}
                      color="near-black"
                      fontWeight="bold"
                      lineHeight={"1em"}
                    >
                      $0.42
                    </Text>
                    <Text color="mid-gray" fontSize={1}>
                      0.00112 ETH
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  bg={"near-white"}
                  p={[2, 3]}
                  alignItems={"center"}
                  flexDirection={["column", "row"]}
                >
                  <Text color="near-black" fontWeight="bold">
                    Estimated time
                  </Text>
                  <Text color={"mid-gray"}>Less than 2 minutes</Text>
                </Flex>
              </Flex>
              <Flex justifyContent="flex-end">
                <Button.Outline onClick={closeModal} mr={1}>Cancel</Button.Outline>
                <Button onClick={closeModal}>Fractionate!</Button>
              </Flex>
            </Flex>
          </Box>
        </Card>
      </Modal>
    </>
  );
};

FractionateButton.propTypes = {
};

const mapStateToProps = ({
  wallet: { connected: { address: connectedWalletAddress } },
}) => ({
  connectedWalletAddress,
});

export default connect(mapStateToProps)(FractionateButton);
