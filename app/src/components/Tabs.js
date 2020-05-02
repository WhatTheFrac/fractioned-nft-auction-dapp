import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Blockie, MetaMaskButton, Flex, Card, Box, Text, Loader } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';

// actions
import { connectWalletAction } from '../actions/walletActions';
import { getNetworkNameById, truncateHexString } from '../utils';

const Tabs = (props) => {
  const {tabData} = props;

  const [tabIndexSelected, setTabIndexSelected] = useState(0);

  let tabs = [];
  let content = <>;

  tabData.foreach((index, tabData) => {
    if (index === tabIndexSelected) {
      tabs[] = <Button>{tabData.title}</Button>;
      content = tabData.content;
    } else {
      tabs[] = <Button.Outline onClick={setTabIndexSelected.bind(index)}>{tabData.title}</Button.Outline>;
    }
  });

  return (
    <Flex flexDirection="column">
      <Flex>
        {tabs}
      </Flex>
      {content}
    </Flex>
  );
};

Tabs.propTypes = {
  tabData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.element.isRequired,
    })
  ).isRequired,
};

export default Tabs;
