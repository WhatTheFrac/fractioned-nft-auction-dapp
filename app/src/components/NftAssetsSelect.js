import React from 'react';
import { Flex, Loader, Text, Avatar, theme } from 'rimble-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectSearch from 'react-select-search';
import styled from 'styled-components';


const CircleImage = styled(Avatar)`
  ${({ backgroundColor }) => backgroundColor && `background-color: #${backgroundColor}`};
`;

const SelectedOptionWrapper = styled(Flex)`
  height: 3rem;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-color: #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
  ${({ disabled }) => !disabled && `
    cursor: pointer;
    &:hover {
      box-shadow: 0px 2px 6px rgba(0,0,0,0.3);
    }
  `}
  ${({ disabled }) => !!disabled && `&, * { cursor: not-allowed !important; }`}
`;

const StyledInput = styled.input`
  color: ${theme.colors.text};
`;

const renderOptionImage = (option) => <CircleImage src={option.image} size={25} backgroundColor={option.backgroundColor} mr={2} />;

const renderOption = (props, option, snapshot, className) => (
  <button {...props} className={className} type="button">
    <Flex>
      {renderOptionImage(option)}
      <Text mt={0.5}>{option.name}</Text>
    </Flex>
  </button>
);

const NftAssetsSelect = ({
  assets,
  isFetching,
  onChange,
  disabled,
}) => {
  const selectOptions = assets.map((asset) => {
    const { title: name, uid, backgroundColor, image } = asset;
    return {
      value: uid,
      name,
      backgroundColor,
      image,
    }
  });

  const selectDisabled = disabled || isFetching || !assets || !assets.length;

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
      <SelectedOptionWrapper disabled={selectDisabled}>
        {value && renderOptionImage(value)}
        <StyledInput
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
      onChange={onChange}
      search
    />
  );
};

NftAssetsSelect.propTypes = {
  isFetching: PropTypes.bool,
  assets: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
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
