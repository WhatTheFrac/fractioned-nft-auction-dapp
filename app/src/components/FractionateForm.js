import React, { useState } from 'react';
import styled from 'styled-components';
import { Field, Box, Input, Card, Flex, Heading, Text } from 'rimble-ui';
import { Icon } from '@rimble/icons';

// components
import NftAssetsSelect from './NftAssetsSelect';
import FractionateButton from './FractionateButton';


const FormWrapper = styled.div`
  background: #eee;
  border-radius: 10px;
  width: 98%;
`;

const InputWrapper = styled(Card)`
  border-radius: 15px;
  margin: 0 -1%;
  border: 2px solid #eee;
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

const FractionateForm = (props) => {
  const [estimatedValue, setEstimatedValue] = useState('');
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <FormWrapper>
        <Heading px={30} py={20}>Deposit</Heading>
        <InputWrapper mt={3}>
          <Flex alignItems="top" flexWrap="wrap" width="100%">
            <Field label="NFT" style={{ flex: 0.52 }}>
              <NftAssetsSelect borderless required />
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
          <StatusText>
            <StatusIcon><Icon name="Cancel" color="danger" size={17} /></StatusIcon>
            Unconfirmed
          </StatusText>
        </InputWrapper>
        <Heading mt={2} px={30} py={20}>Receive</Heading><InputWrapper mt={3}>
        <Flex alignItems="top" flexWrap="wrap" width="100%">
          <Field label="NFT" style={{ flex: 0.52 }}>
            <NftAssetsSelect borderless required />
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

export default FractionateForm;
