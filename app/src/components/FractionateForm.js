import React, { useState } from 'react';
import styled from 'styled-components';
import { Field, Input, Card, Flex, Heading, Text, Avatar } from 'rimble-ui';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// components
import NftAssetsSelect from './NftAssetsSelect';
import FractionateButton from './FractionateButton';

// utils
import { parseNumberInputValue } from '../utils';


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

const FractionateForm = ({ nftAssets }) => {
  const [estimatedValue, setEstimatedValue] = useState('');
  const [fractionCountValue, setfractionCountValue] = useState(1000);
  const [balancerCountValue, setBalancerCountValue] = useState(500);
  const [selectedNftId, setSelectedNftId] = useState('');
  const selectedNft = nftAssets.find(({ uid }) => uid === selectedNftId);
  const submitDisabled = isEmpty(selectedNft) || isEmpty(estimatedValue);
  const heading = (title) => <Heading as={"h3"} px={30} py={20}>{title}</Heading>;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <FormWrapper>
        {heading("Deposit")}
        <InputWrapper mt={3}>
          <Flex flexWrap="wrap" width="100%">
            <Field label="NFT" style={{ flex: 0.52 }}>
              <NftAssetsSelect borderless required onChange={setSelectedNftId} />
            </Field>
            <Text style={{ flex: 0.05 }} textAlign="center" mt={40} px={15} fontSize={24} color={'#d2d2d2'}>=</Text>
            <Field label="Estimated value" style={{ flex: 0.43 }}>
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
            {heading("Mint")}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="How many NFT tokens would you like to create?" style={{ flex: 0.3 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => setfractionCountValue(parseNumberInputValue(event.target.value, true))}
                    value={fractionCountValue}
                    width="100%"
                  />
                </Field>
                <Text style={{ flex: 0.15 }} textAlign="center" mb={28} px={15} fontSize={16} color={'#d2d2d2'}>tokens of</Text>
                <Flex style={{ flex: 0.6 }} height={80} alignItems="center" justifyConten="center">
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
            {heading("Sell")}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="How many of these tokens would you like to sell?" style={{ flex: 0.3 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => setfractionCountValue(parseNumberInputValue(event.target.value, true))}
                    value={balancerCountValue}
                    width="100%"
                  />
                </Field>
                <Text style={{ flex: 0.15 }} textAlign="center" mb={28} px={15} fontSize={16} color={'#d2d2d2'}>tokens of</Text>
                <Flex style={{ flex: 0.6 }} height={80} alignItems="center" justifyConten="center">
                  <Input
                    type="text"
                    value={selectedNft.title}
                    disabled
                    style={{ flex: 1 }}
                  />
                  <Avatar src={selectedNft.image} size={45} backgroundColor={selectedNft.backgroundColor} ml={3} />
                </Flex>
              </Flex>
            </InputWrapper>
            {heading("Sell")}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="How many of these tokens would you like to sell?" style={{ flex: 0.3 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => setfractionCountValue(parseNumberInputValue(event.target.value, true))}
                    value={balancerCountValue}
                    width="100%"
                  />
                </Field>
                <Text style={{ flex: 0.15 }} textAlign="center" mb={28} px={15} fontSize={16} color={'#d2d2d2'}>tokens of</Text>
                <Flex style={{ flex: 0.6 }} height={80} alignItems="center" justifyConten="center">
                  <Input
                    type="text"
                    value={selectedNft.title}
                    disabled
                    style={{ flex: 1 }}
                  />
                  <Avatar src={selectedNft.image} size={45} backgroundColor={selectedNft.backgroundColor} ml={3} />
                </Flex>
              </Flex>
            </InputWrapper>
          </>
        )}
        {!isEmpty(fractionCountValue) && <Text>DERP</Text>}
      </FormWrapper>
      <FractionateButton
        selectedNft={selectedNft}
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
