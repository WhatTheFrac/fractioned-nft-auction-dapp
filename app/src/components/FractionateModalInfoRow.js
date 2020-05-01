import React, { useState, useEffect } from 'react';
import { Flex, Loader, Text, Avatar, Card, Button, Modal, Box, Heading, Image, Link, Icon, Tooltip} from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Eth } from '@rimble/icons';

// utils
import { getTokenBalance } from '../utils';


const FractionateModalInfoRow = (props) => {
  const {
    title,
    description,
    data,
    secondaryData,
  } = props;

  const [balance, setBalance] = useState(0);
  const [isFetchingTokenBalance, setIsFetchingTokenBalance] = useState(true)

  let descriptionDisplay = description
    ? <Tooltip
        message={description}
        position="top"
      >
        <Icon
          ml={1}
          name={"InfoOutline"}
          size={"14px"}
          color={"primary"}
        />
      </Tooltip>
    : null;

  let secondaryDataDisplay = secondaryData
    ? <Text color="mid-gray" fontSize={1}>{secondaryData}</Text>
    : null;

  return (
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
          {title}
        </Text>
        {descriptionDisplay}
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
          {data}
        </Text>
        {secondaryDataDisplay}
      </Flex>
    </Flex>
  );
};

FractionateModalInfoRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  data: PropTypes.string.isRequired,
  secondaryData: PropTypes.string,
};

const mapStateToProps = ({
}) => ({
});

export default connect(mapStateToProps)(FractionateModalInfoRow);
