import React, { useState } from 'react';
import styled from 'styled-components';
import { Field, Input, Card, Flex, Heading, Text, Avatar } from 'rimble-ui';
import { Icon } from '@rimble/icons';
import isEmpty from 'lodash/isEmpty';

// components
import NftAssetsSelect from './NftAssetsSelect';
import FractionateButton from './FractionateButton';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const FormWrapper = styled.div`
  background: #eee;
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
  const [fractionValue, setFractionValue] = useState('');
  const [selectedNftKey, setSelectedNftKey] = useState('');
  const selectedNft = nftAssets.find(({ uid }) => uid === selectedNftKey);
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <FormWrapper>
        <Heading px={30} py={20}>Deposit</Heading>
        <InputWrapper mt={3}>
          <Flex flexWrap="wrap" width="100%">
            <Field label="NFT" style={{ flex: 0.52 }}>
              <NftAssetsSelect borderless required onChange={setSelectedNftKey} />
            </Field>
            <Text style={{ flex: 0.05 }} textAlign="center" mt={40} px={15} fontSize={24} color={'#d2d2d2'}>=</Text>
            <Field label="Estimated value" style={{ flex: 0.43 }}>
              <Input
                type="text"
                required
                onChange={(event) => setEstimatedValue(event.target.value)}
                value={estimatedValue}
                width="100%"
                placeholder="0.00 USD"
              />
            </Field>
          </Flex>
          <StatusText isSuccess>
            <StatusIcon><Icon name="CheckCircle" color="success" size={17} /></StatusIcon>
            Confirmed
          </StatusText>
        </InputWrapper>
        {!isEmpty(selectedNft) && (
          <>
            <Heading mt={2} px={30} py={20}>Receive</Heading>
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" flexWrap="wrap" width="100%">
                <Field label="NFT tokens" style={{ flex: 0.3 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => setFractionValue(event.target.value)}
                    value={fractionValue}
                    width="100%"
                    placeholder="1.000"
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
              <StatusText>
                <StatusIcon><Icon name="Cancel" color="danger" size={17} /></StatusIcon>
                Unconfirmed
              </StatusText>
            </InputWrapper>
          </>
        )}
      </FormWrapper>
      <FractionateButton
        buttonProps={{
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
