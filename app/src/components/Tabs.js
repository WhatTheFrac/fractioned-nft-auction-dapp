import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from 'rimble-ui';


const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: Column;
`;

const TabButton = styled.button`
  background: #eee;
  font-size: 18px;
  border: none;
  padding: 10px 0px;
  border-radius: 15px;
  cursor: pointer;
  flex: 1;
  &:focus {
    outline: none;
  }
  ${({ isActive }) => `
    color: ${isActive ? '#fff' : '#000'};
    background: ${isActive ? theme.colors.primary : 'none'};
  `}
  &:hover {
    color: #fff;
    background: ${theme.colors.primary};
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background: #eee;
  border-radius: 15px;
  overflow: hidden;
  &:hover > ${TabButton}:not(:hover) {
    color: #000;
    background: none;
  }
`;
const Tabs = ({ tabData }) => {
  const [tabIndexSelected, setTabIndexSelected] = useState(0);

  const tabs = tabData.map((tabData, index) => {
    const isActive = index === tabIndexSelected;
    return (
      <TabButton isActive={isActive} key={index} onClick={() => !isActive && setTabIndexSelected(index)}>
        {tabData.title}
      </TabButton>
    )
  });

  const content = tabData[tabIndexSelected].content;

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
