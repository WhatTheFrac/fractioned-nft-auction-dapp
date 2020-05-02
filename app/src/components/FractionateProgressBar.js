import React, { useState } from 'react';
import { Flex, Text, Box, Link, Icon} from 'rimble-ui';
import PropTypes from 'prop-types';

const FractionateProgressBar = (props) => {
  const SLOW_THRESHOLD = 0.9; // at what percentage the bar starts slowing down
  const SLOW_FACTOR = 5; // how much slower the bar will go (5 = 1/5 rate)
  const UPDATE_INTERVAL_MS = 1000; // how often to update the progress bar
  const MAX_BAR_PROGRESS = 0.99; // the largest progress that will be shown

  // calculate how long the bar takes to ease, should be half the update interval
  const WIDTH_EASE_INTERVAL = (UPDATE_INTERVAL_MS / 2 / 1000).toFixed(1).toString() + "s";
  // this style makes the bar move smoothly
  const progressBarStyle = {transition: "width "+WIDTH_EASE_INTERVAL+" ease"};

  const {estimatedTimeInSeconds} = props;

  const getCurrentTime = () => Math.floor(Date.now() / 1000);

  const [startTime] = useState(getCurrentTime());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const updateCurrentTime = () => {
    setCurrentTime(getCurrentTime());
  }

  let timeElapsed = currentTime - startTime;
  let percentage = timeElapsed / estimatedTimeInSeconds;

  let displayPercentage =
    percentage < SLOW_THRESHOLD
      ? percentage
      : SLOW_THRESHOLD + (timeElapsed - estimatedTimeInSeconds*SLOW_THRESHOLD) / (estimatedTimeInSeconds*SLOW_FACTOR);

  displayPercentage = Math.min(displayPercentage, MAX_BAR_PROGRESS);

  setTimeout(updateCurrentTime, UPDATE_INTERVAL_MS);

  return (
    <Flex flexDirection={"column"}>
      <Box bg={"success"} width={displayPercentage} style={progressBarStyle} py={2} />
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
            <Text>{(displayPercentage*100).toFixed(0)}%</Text>
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
              target="_blank"
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

export default FractionateProgressBar;
