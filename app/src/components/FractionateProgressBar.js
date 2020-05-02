import React, { useState } from 'react';
import { Flex, Loader, Text, Card, Button, Modal, Box, Heading, Link, Icon} from 'rimble-ui';
import { connect } from 'react-redux';
import { Eth } from '@rimble/icons';
import PropTypes from 'prop-types';

const FractionateProgressBar = (props) => {
  const {estimatedTimeInSeconds} = props;

  const getCurrentTime = () => Math.floor(Date.now() / 1000);

  const [startTime, _] = useState(getCurrentTime());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const updateCurrentTime = () => {
    setCurrentTime(getCurrentTime());
  }

  let timeElapsed = currentTime - startTime;
  let percentage = timeElapsed / estimatedTimeInSeconds;

  // show accurate percentage up to a threshold then slow down the progress bar 10x
  const SLOW_THRESHOLD = 0.9;
  let displayPercentage =
    percentage < SLOW_THRESHOLD
      ? percentage
      : SLOW_THRESHOLD + (timeElapsed / (estimatedTimeInSeconds*10));

  displayPercentage = Math.min((displayPercentage*100).toFixed(0), 100);


  setTimeout(updateCurrentTime, 1000);

  return (
    <Flex flexDirection={"column"}>
      <Box bg={"success"} width={displayPercentage / 100} py={2} />
      <Flex
        bg="primary"
        p={3}
        borderBottom={"1px solid gray"}
        borderColor={"moon-gray"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDirection={["column", "row"]}
      >
        <Box height={"2em"} width={"2em"} mr={[0, 3]} mb={3}>
          <Flex
            bg={"near-white"}
            borderRadius={"50%"}
            height={"3em"}
            width={"3em"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text>{displayPercentage}%</Text>
          </Flex>
        </Box>
        <Box>
          <Text
            textAlign={["center", "left"]}
            color="near-white"
            ml={[0, 3]}
            my={[1, 0]}
            fontSize={3}
            lineHeight={"1.25em"}
          >
            Sending...
          </Text>
        </Box>
        <Box>
          <Flex flexDirection="row" alignItems="center">
            <Link
              color="near-white"
              ml={[0, 3]}
              fontSize={1}
              lineHeight={"1.25em"}
              href="https://etherscan.io"
            >
              Details
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
    </Flex>
  );
};

FractionateProgressBar.propTypes = {
  estimatedTimeInSeconds: PropTypes.number.isRequired,
};

const mapStateToProps = ({
  wallet: { connected: { address: connectedWalletAddress } },
}) => ({
  connectedWalletAddress,
});

export default connect(mapStateToProps)(FractionateProgressBar);
