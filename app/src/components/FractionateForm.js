import React, { useState } from 'react';
import styled from 'styled-components';
import { Field, Input, Select, Card, Flex, Heading, Text, Avatar } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


// components
import NftAssetsSelect from './NftAssetsSelect';
import FractionateButton from './FractionateButton';

// utils
import { parseNumberInputValue } from '../utils';
import { theme } from 'rimble-ui';


const FormWrapper = styled.div`
  background: #ebe9f9;
  border-radius: 10px;
  width: 98%;
`;

const InputWrapper = styled(Card)`
  border-radius: 15px;
  margin: 0 -1%;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StatusIcon = styled.span`
  opacity: 0.5;
  position: relative;
  top: 4px;
  padding-right: 4px;
`;

const StatusText = styled(Text)`
  color: ${({ isSuccess }) => isSuccess ? '#605e69' : '#c2c2c2'};
  font-size: 15px;
`;

const ButtonGroup = styled(Flex)`
  border: 1px solid ${theme.colors.grey};
  border-radius: 12px;
`

const GroupedButton = styled.div`
  background-color: #4CAF50;
  border-radius: 12px;
  color: ${theme.colors.grey};
  padding: 8px;
  cursor: pointer; /* Pointer/hand icon */
  float: left; /* Float the buttons side by side */
  ${({ isActive }) => `
    color: ${isActive ? '#fff' : '#000'};
    background: ${isActive ? theme.colors.primary : 'none'};
  `}
  &:hover {
    color: #fff;
    background: ${theme.colors.primary};
  }
`

const StyledDropdown = styled(Dropdown)`
  border-radius: 12px;
  width: 100%;
`

const FractionateForm = ({ nftAssets }) => {
  const [estimatedValue, setEstimatedValue] = useState('');
  const [fractionCountValue, setFractionCountValue] = useState(1000);
  const [balancerCountValue, setBalancerCountValue] = useState('');
  const [selectedNftId, setSelectedNftId] = useState('');
  const [minBid, setMinBid] = useState('');
  const [minBidIncrease, setMinBidIncrease] = useState('');
  const [auctionDurationSeconds, setAuctionDurationSeconds] = useState('');

  const selectedNft = nftAssets.find(({ uid }) => uid === selectedNftId);
  const submitDisabled = isEmpty(selectedNft) || isEmpty(estimatedValue);

  const heading = (title) => <Heading as={"h3"} px={30} pt={40} pb={20}>{title}</Heading>;

  const updateFractionCountValue = count => {
    setFractionCountValue(parseInt(count));
    if (count < balancerCountValue) {
      setBalancerCountValue(count);
    }
  };

  const updateBalancerCountValue = count => {
    if (count > fractionCountValue) {
      setBalancerCountValue(fractionCountValue);
    } else {
      setBalancerCountValue(count);
    }
  }

  const updateBalancerPortion = portion => updateBalancerCountValue(fractionCountValue * portion / 100);
  let groupedButtons = [1,5,10,25,50,75,100].map((portion) =>
    <GroupedButton
      key={portion}
      onClick={() => updateBalancerPortion(portion)}
      isActive={parseInt(balancerCountValue) === fractionCountValue * portion / 100}>
      {portion + "%"}
    </GroupedButton>
  );

  const minBidIncreaseOptions = [1,3,5,10].map(x => {return {value: x, label: x+"%"};});
  const auctionDurationOptions = [
    { value: 86400, label: "1 day" },
    { value: 259200, label: "3 days" },
    { value: 604800, label: "1 week" },
    { value: 2592000, label: "1 month" }
  ];

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" pb={80}>
      <FormWrapper>
        {heading("Deposit NFT")}
        <InputWrapper mt={3}>
          <Flex flexWrap="wrap" width="100%">
            <Field label="NFT" style={{ flex: 0.52 }}>
              <NftAssetsSelect borderless required onChange={setSelectedNftId} />
            </Field>
            <Text style={{ flex: 0.05 }} textAlign="center" mt={40} px={15} fontSize={24} color={'#d2d2d2'}>=</Text>
            <Field label="Estimated value USD" style={{ flex: 0.43 }}>
              <Input
                type="text"
                required
                onChange={(event) => setEstimatedValue(parseNumberInputValue(event.target.value))}
                value={estimatedValue}
                width="100%"
                placeholder="0.00 USD"
              />
            </Field>
          </Flex>
          {/*<StatusText isSuccess>*/}
          {/*  <StatusIcon><Icon name="CheckCircle" color="success" size={17} /></StatusIcon>*/}
          {/*  Confirmed*/}
          {/*</StatusText>*/}
        </InputWrapper>
        {!isEmpty(selectedNft) && !isEmpty(estimatedValue) && (
          <>
            {heading("Mint Fraction Tokens")}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="How many NFT tokens would you like to create?" style={{ flex: 0.3 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => updateFractionCountValue(parseNumberInputValue(event.target.value, true))}
                    value={fractionCountValue}
                    width="100%"
                  />
                </Field>
                <Text style={{ flex: 0.15 }} textAlign="center" mb={28} px={15} fontSize={16} color={'#d2d2d2'}>tokens of</Text>
                <Flex style={{ flex: 0.6 }} height={80} alignItems="center" justifyContent="center">
                  <Input
                    type="text"
                    value={selectedNft.title}
                    disabled
                    style={{ flex: 1 }}
                  />
                  <Avatar src={selectedNft.image} size={45} backgroundColor={selectedNft.backgroundColor} ml={3} />
                </Flex>
              </Flex>
              {/*<StatusText>*/}
              {/*  <StatusIcon><Icon name="Cancel" color="danger" size={17} /></StatusIcon>*/}
              {/*  Unconfirmed*/}
              {/*</StatusText>*/}
            </InputWrapper>
            {heading("Sell Fraction Tokens")}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="What portion would you like to sell?" style={{ flex: 0.3 }}>
                  <ButtonGroup required style={{ flex: 0.5 }}>{groupedButtons}</ButtonGroup>
                </Field>
                <Flex style={{ flex: 0.1 }} height={80} pl={15} alignItems="center" justifyConten="center">
                  <Input
                    type="text"
                    required
                    onChange={e => updateBalancerCountValue(parseNumberInputValue(e.target.value))}
                    value={balancerCountValue}
                    style={{ flex: 1 }}
                    placeholder={"ie: "+(fractionCountValue/2)}
                  />
                </Flex>
                <Flex style={{ flex: 0.4 }} flexWrap="nowrap">
                  <Text mb={28} px={15} fontSize={16}>tokens</Text>
                </Flex>
              </Flex>
            </InputWrapper>
          </>
        )}
        {balancerCountValue !== "" && (
          <>
            {heading("Provide Auction Details")}
              <InputWrapper mt={3}>
                <Flex flexWrap="wrap" width="100%">
                  <Field label="Minimum bid USD" pr={16} style={{ flex: 0.33 }}>
                    <Input
                      type="text"
                      required
                      onChange={(event) => setMinBid(parseNumberInputValue(event.target.value))}
                      value={minBid}
                      width="100%"
                      placeholder="0.00 USD"
                    />
                  </Field>
                  <Field label="Minimum bid increase" height={80} pr={16} style={{ flex: 0.33 }}>
                    <StyledDropdown
                      required
                      options={minBidIncreaseOptions}
                      onChange={setMinBidIncrease}
                      value={minBidIncrease}
                    />
                  </Field>
                  <Field label="Auction duration" height={80} style={{ flex: 0.34 }}>
                    <StyledDropdown
                      required
                      options={auctionDurationOptions}
                      onChange={setAuctionDurationSeconds}
                      value={auctionDurationSeconds}
                    />
                  </Field>
                </Flex>
                {/*<StatusText isSuccess>*/}
                {/*  <StatusIcon><Icon name="CheckCircle" color="success" size={17} /></StatusIcon>*/}
                {/*  Confirmed*/}
                {/*</StatusText>*/}
              </InputWrapper>
          </>
        )}
      </FormWrapper>
      <FractionateButton
        selectedNft={selectedNft}
        nftTokenAmount={Number(fractionValue) || 1000}
        buttonProps={{
          disabled: !!submitDisabled,
          mt: 40,
          width: 1/2,
        }}
      />
    </Flex>
  );
};

FractionateForm.propTypes = {
  nftAssets: PropTypes.array,
};

const mapStateToProps = ({
  wallet: { nftAssets },
}) => ({
  nftAssets,
});

export default connect(mapStateToProps)(FractionateForm);
