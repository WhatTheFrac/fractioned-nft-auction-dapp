import React from 'react';
import { Flex, Text, Card, Button, Modal, Box, Heading, Image, Link, Icon} from 'rimble-ui';
import PropTypes from 'prop-types';

const FractionateSuccessDialog = (props) => {
  let {isOpen, closeHook} = props;

  return(
    <Modal isOpen={isOpen}>
      <Card p={0} borderRadius={1} mb={4}>
        <Box height="4px" bg="success" borderRadius={["1rem 1rem 0 0"]} />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          borderColor="near-white"
          p={[3, 4]}
          pb={3}
        >
          <Icon name="CheckCircle" color="success" aria-label="Success" />
          <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
            Success! You have fractionalized your NFT.
          </Heading>
          <Link onClick={closeHook}>
            <Icon
              name="Close"
              color="moon-gray"
              aria-label="Close and cancel connection"
            />
          </Link>
        </Flex>
        <Box p={[3, 4]} pb={2}>
          <Text textAlign="center" mt={2}>
            Your fractional NFT tokens should be in your wallet, see below:
          </Text>
          <Flex mt={4} justifyContent="center">
            <Card p={3} borderRadius={16}>
              <Image src="logo256.png" size="156px" />
            </Card>
          </Flex>
        </Box>
        <Flex pt={2} pb={4} justifyContent="center" flexDirection="column">
          <Heading textAlign="center" as="h4">
            Fractional NFTs
          </Heading>
        </Flex>
        <Flex
          pt={[4, 4]}
          pb={[4, 4]}
          p={[3, 4]}
          borderTop={1}
          borderColor="near-white"
          justifyContent="flex-end"
          flexDirection={["column", "row"]}
          alignItems="center"
        >
          <Button.Outline onClick={closeHook} mr={[0, 3]} mb={[2, 0]} width={["100%", "auto"]}>
            Close
          </Button.Outline>
          <Link href="https://balancer.exchange/" target="_blank">
            <Button width={["100%", "auto"]}>See Balancer pool</Button>
          </Link>
        </Flex>
      </Card>
    </Modal>
  );
};

FractionateSuccessDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeHook: PropTypes.func.isRequired,
};

export default FractionateSuccessDialog;
