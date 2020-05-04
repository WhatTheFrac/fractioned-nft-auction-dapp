import React from 'react';
import { Flex, Text, Card, Button, Modal, Box, Heading, Link, Icon} from 'rimble-ui';
import PropTypes from 'prop-types';

const FractionateFailureDialog = (props) => {
  let {isOpen, closeHook} = props;

  return(
    <Modal isOpen={isOpen}>
      <Card p={0} borderRadius={1} mb={4}>
        <Box height="4px" bg="danger" borderRadius={["1rem 1rem 0 0"]} />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          borderColor="near-white"
          p={[3, 4]}
          pb={3}
        >
          <Icon name="Warning" color="danger" aria-label="Warning" />
          <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
            Fractionalizing NFT Failed.
          </Heading>
          <Link onClick={closeHook}>
            <Icon
              name="Close"
              color="moon-gray"
              aria-label="Close and cancel connection"
            />
          </Link>
        </Flex>
        <Text p={[3, 4]}>
          We couldn’t confirm your purchase because your transaction fee proved too
          low. Based on the network right now, we recommend trying again with a
          transaction fee of at least 0.005 ETH.
        </Text>
        <Flex
          p={[3, 4]}
          borderTop={1}
          borderColor="near-white"
          justifyContent="flex-end"
          flexDirection={["column", "row"]}
          alignItems="center"
        >
          <Link href="https://etherscan.io/" target="_blank">
            <Button.Outline mr={[0, 3]} mb={[2, 0]} width={["100%", "auto"]}>
              View on Etherscan
            </Button.Outline>
          </Link>
          <Button onClick={closeHook} width={["100%", "auto"]}>Try again</Button>
        </Flex>
      </Card>
    </Modal>
  );
};

FractionateFailureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeHook: PropTypes.func.isRequired,
};

export default FractionateFailureDialog;
