import React from 'react';
import { Flex, Loader, Text, Avatar } from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectSearch from 'react-select-search';
import styled from 'styled-components';


const CircleImage = styled(Avatar)`
  ${({ backgroundColor }) => backgroundColor && `background-color: #${backgroundColor}`};
`;

const SelectedOptionWrapper = styled(Flex)`
  cursor: pointer;
  height: 56px;
  padding: 10px 16px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
  border: 1px solid #eee;
`;

const renderOptionImage = (option) => <CircleImage src={option.image} backgroundColor={option.backgroundColor} mr={2} />;

const renderOption = (props, option, snapshot, className) => (
  <button {...props} className={className} type="button">
    <Flex>
      {renderOptionImage(option)}
      <Text mt={1}>{option.name}</Text>
    </Flex>
  </button>
);

const NftAssetsSelect = (props) => {
  const { assets, isFetching } = props;

  const selectOptions = assets.map((asset) => {
    const { title: name, tokenAddress, tokenId, backgroundColor, image } = asset;
    return {
      value: `${tokenAddress}-${tokenId}`,
      name,
      backgroundColor,
      image,
    }
  });

  const selectDisabled = isFetching || !assets || !assets.length;

  const renderSelectedOption = (valueProps, snapshot, className) => {
    const { value } = snapshot;

    if (!value && isFetching) {
      return (
        <SelectedOptionWrapper alignItems="center">
          <Loader size={20} mr={2}/>
          <Text mt={1}>Fetching NFT assets</Text>
        </SelectedOptionWrapper>
      )
    }

    return (
      <SelectedOptionWrapper>
        {value && renderOptionImage(value)}
        <input
          {...valueProps}
          style={{ flex: 1 }}
          className={className}
          value={valueProps.value}
          disabled={selectDisabled}
          placeholder={selectDisabled ? 'No NFT assets found' : "Select NFT"}
        />
      </SelectedOptionWrapper>
    );
  };

  return (
    <SelectSearch
      options={selectOptions}
      disabled={selectDisabled}
      renderOption={renderOption}
      renderValue={renderSelectedOption}
      search
    />
  );
};

NftAssetsSelect.propTypes = {
  isFetching: PropTypes.bool,
  assets: PropTypes.array,
};

const mapStateToProps = ({
  wallet: {
    isFetchingNftAssets: isFetching,
    nftAssets: assets,
  },
}) => ({
  isFetching,
  assets,
});

export default connect(mapStateToProps)(NftAssetsSelect);
