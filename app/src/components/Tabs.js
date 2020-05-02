import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'rimble-ui';
import styled from 'styled-components';

const ComponentWrapper = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: Column;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tabs = (props) => {
  const {tabData} = props;
  const [tabIndexSelected, setTabIndexSelected] = useState(0);

  console.log({tabData: tabData, tabIndexSelected: tabIndexSelected});

  let tabs = [];
  let content = null;

  let buttonStyle = {marginRight: "2px"};

  tabData.forEach((tabData, index) => {
    console.log({index: index});
    if (index === tabIndexSelected) {
      tabs.push(<Button style={buttonStyle}>{tabData.title}</Button>);
      content = tabData.content;
    } else {
      tabs.push(
        <Button.Outline style={buttonStyle} onClick={() => setTabIndexSelected(index)}>
          {tabData.title}
        </Button.Outline>
      );
    }
  });

  return (
    <ComponentWrapper>
      <TabsWrapper>
        {tabs}
      </TabsWrapper>
      {content}
    </ComponentWrapper>
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
