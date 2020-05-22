import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Field,
  Input,
  Card,
  Flex,
  Heading,
  Text,
  Avatar,
  Button,
  Box,
  Icon,
  Loader,
  Link,
  theme,
} from 'rimble-ui';
import { Dai as DaiIcon } from '@rimble/icons';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';

// actions
import { approveNftTransactionAction, approveTokenTransactionAction } from '../actions/transactionActions';
import { removeNftFromWalletAssetsAction } from '../actions/walletActions';

// components
import NftAssetsSelect from './NftAssetsSelect';
import FractionateButton from './FractionateButton';

// constants
import { STATUS_PENDING, TRANSACTION_TYPE } from '../constants/transactionConstants';

// utils
import {
  getDaiAddress,
  getFrackerContractAddress,
  getTokenAllowance,
  parseNumberInputValue,
  ExplanationString,
  getTransactionDetailsLink,
  isNftTransferApproved,
} from '../utils';


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
  color: #605e69;
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

const renderHeading = (title, description) => (
  <Heading as={"h3"} px={30} pt={40} pb={20}>
    {title}
    {!!description && (
      <Flex mt={2}>
        <Text fontSize={1}>{description}</Text>
      </Flex>
    )}
  </Heading>
);

const FractionateForm = ({
  nftAssets,
  balances,
  transactions,
  connectedWalletAddress,
  networkId,
  approveTokenTransaction,
  approveNftTransaction,
  removeNftFromWalletAssets,
}) => {
  const [estimatedValue, setEstimatedValue] = useState('');
  const [fractionCountValue, setFractionCountValue] = useState(1000);
  const [balancerCountValue, setBalancerCountValue] = useState(0);
  const [selectedNftId, setSelectedNftId] = useState('');
  const [minBid, setMinBid] = useState('');
  const [minBidIncrease, setMinBidIncrease] = useState('');
  const [auctionDurationSeconds, setAuctionDurationSeconds] = useState('');
  const [unlockedDaiAmount, setUnlockedDaiAmount] = useState(0);
  const [gettingDaiAllowance, setGettingDaiAllowance] = useState(false);
  const [gettingTokenApproval, setGettingTokenApproval] = useState(false);
  const [approvedNftId, setApprovedNftId] = useState('');

  const resetForm = (isSuccess) => {
    if (isSuccess) removeNftFromWalletAssets(selectedNftId);
    setEstimatedValue('');
    setFractionCountValue(1000);
    setBalancerCountValue(0);
    setSelectedNftId('');
    setMinBid('');
    setMinBidIncrease('');
    setAuctionDurationSeconds('');
  };

  useEffect(() => {
    if (gettingDaiAllowance) return;
    setGettingDaiAllowance(true);
    getTokenAllowance(
      connectedWalletAddress,
      getFrackerContractAddress(networkId),
      getDaiAddress(networkId),
      18,
    )
      .then(setUnlockedDaiAmount)
      .then(() => setGettingDaiAllowance(false));
  }, [transactions]);

  const selectedNft = nftAssets.find(({ uid }) => uid === selectedNftId) || {};

  useEffect(() => {
    if (gettingTokenApproval || !selectedNftId) return;
    setGettingTokenApproval(true);
    isNftTransferApproved(
      getFrackerContractAddress(networkId),
      selectedNft.tokenAddress,
      selectedNft.tokenId,
    )
      .then((isApproved) => isApproved && setApprovedNftId(selectedNft.uid))
      .then(() => setGettingTokenApproval(false));
  }, [transactions, selectedNftId]);


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
  let groupedButtons = [0, 1, 5, 10, 25, 50, 75, 100].map((portion) =>
    <GroupedButton
      key={portion}
      onClick={() => updateBalancerPortion(portion)}
      isActive={(portion === 0 && balancerCountValue === 0) || balancerCountValue === fractionCountValue * portion / 100}>
      {portion === 0 ? 'None' : portion + "%"}
    </GroupedButton>
  );

  const minBidIncreaseOptions = [1,3,5,10].map(x => {return {value: x, label: x+"%"};});
  const auctionDurationOptions = [
    { value: 86400, label: "1 day" },
    { value: 259200, label: "3 days" },
    { value: 604800, label: "1 week" },
    { value: 2592000, label: "1 month" }
  ];

  const daiAllowanceTransaction = transactions.find((transaction) => transaction.type === TRANSACTION_TYPE.FRACTIONATE_TOKEN_APPROVE) || {};
  const isDaiAllowanceTransactionPending = daiAllowanceTransaction.status === STATUS_PENDING;
  const daiAmount = Number((balancerCountValue / fractionCountValue) * (estimatedValue * 0.02).toFixed(18)); // DAI has 18 decimals
  const { balance: daiBalance = 0 } = balances.find((balance) => balance.symbol === 'DAI') || {};
  const daiUnlocked = !!daiAmount && unlockedDaiAmount >= daiAmount;
  const enoughDai = !!daiAmount && daiBalance >= daiAmount;
  const unlockDaiButtonDisabled = !enoughDai || daiUnlocked || gettingDaiAllowance || isDaiAllowanceTransactionPending;

  const nftApprovalTransaction = transactions.find((transaction) => transaction.type === TRANSACTION_TYPE.FRACTIONATE_NFT_APPROVE) || {};
  const isNftApprovalTransactionPending = nftApprovalTransaction.status === STATUS_PENDING;
  const selectedNftApproved = approvedNftId === selectedNft.uid;

  const unlockDaiButtonTitle = enoughDai ? 'Unlock DAI' : 'Not enough DAI';

  const submitDisabled = isEmpty(selectedNft)
    || isEmpty(estimatedValue)
    || (!balancerCountValue && balancerCountValue !== 0)
    || (!!balancerCountValue && !daiUnlocked)
    || !minBid
    || !minBidIncrease
    || !auctionDurationSeconds
    || !selectedNftApproved;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" pb={80}>
      <FormWrapper>
        {renderHeading("Deposit NFT", ExplanationString.depositNftExplanation)}
        <InputWrapper mt={3}>
          <Flex flexWrap="wrap" width="100%">
            <Field label="NFT" style={{ flex: 0.52 }}>
              <NftAssetsSelect
                borderless
                required
                onChange={setSelectedNftId}
                disabled={gettingTokenApproval || !!isNftApprovalTransactionPending}
              />
            </Field>
              <Button.Outline
                style={{ flex: 0.2, marginLeft: 15, marginTop: 29 }}
                disabled={!!selectedNftApproved || isEmpty(selectedNft) || !!isNftApprovalTransactionPending}
                onClick={() => approveNftTransaction(selectedNft.tokenAddress, selectedNft.tokenId, getFrackerContractAddress(networkId))}
              >
                {(!!gettingTokenApproval || isNftApprovalTransactionPending) && <Loader size={20} />}
                {!gettingTokenApproval && !isNftApprovalTransactionPending && !isEmpty(selectedNft) && !selectedNftApproved && "Unlock"}
                {!!selectedNftApproved && "Unlocked"}
                {!gettingTokenApproval && isEmpty(selectedNft) && "Select NFT"}
              </Button.Outline>
            <Text style={{ flex: 0.05 }} textAlign="center" mt={40} px={15} fontSize={24} color={'#d2d2d2'}>=</Text>
            <Field label="Estimated value in DAI" style={{ flex: 0.33 }}>
              <Input
                type="text"
                required
                onChange={(event) => setEstimatedValue(parseNumberInputValue(event.target.value))}
                value={estimatedValue}
                width="100%"
                placeholder="0.00 DAI"
              />
            </Field>
          </Flex>
          <StatusText>
            <StatusIcon>
              {!!selectedNftApproved && !isNftApprovalTransactionPending && <Icon name="CheckCircle" color="success" size={17} />}
              {!selectedNftApproved && !isNftApprovalTransactionPending && <Icon name="Cancel" color="danger" size={17} />}
              {!selectedNftApproved && !!isNftApprovalTransactionPending && <Icon name="QueryBuilder" color="blue" size={17} />}
            </StatusIcon>
            {!!selectedNftApproved && !isNftApprovalTransactionPending && 'Confirmed'}
            {!selectedNftApproved && !isNftApprovalTransactionPending && 'Unconfirmed'}
            {!selectedNftApproved && !!isNftApprovalTransactionPending && (
              <Link color="#605e69" href={getTransactionDetailsLink(nftApprovalTransaction.hash, networkId)} target="_blank">Pending</Link>
            )}
          </StatusText>
        </InputWrapper>
        {!isEmpty(selectedNft) && (
          <>
            {renderHeading("Mint Fraction Tokens", ExplanationString.mintFractionExplanation)}
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
            {renderHeading("Provide Auction Details", ExplanationString.auctionExplanation)}
            <InputWrapper mt={3}>
              <Flex flexWrap="wrap" width="100%">
                <Field label="Min starting bid for NFT" pr={16} style={{ flex: 0.33 }}>
                  <Input
                    type="text"
                    required
                    onChange={(event) => setMinBid(parseNumberInputValue(event.target.value))}
                    value={minBid}
                    width="100%"
                    placeholder="0.00 DAI"
                  />
                </Field>
                <Field label="Min bid increase over last" height={80} pr={16} style={{ flex: 0.33 }}>
                  <StyledDropdown
                    required
                    options={minBidIncreaseOptions}
                    onChange={(option) => setMinBidIncrease(option.value)}
                    value={minBidIncreaseOptions.find(({ value }) => value === minBidIncrease)}
                  />
                </Field>
                <Field label="Auction duration" height={80} style={{ flex: 0.34 }}>
                  <StyledDropdown
                    required
                    options={auctionDurationOptions}
                    onChange={(option) => setAuctionDurationSeconds(option.value)}
                    value={auctionDurationOptions.find(({ value }) => value === auctionDurationSeconds)}
                  />
                </Field>
              </Flex>
              {/*<StatusText isSuccess>*/}
              {/*  <StatusIcon><Icon name="CheckCircle" color="success" size={17} /></StatusIcon>*/}
              {/*  Confirmed*/}
              {/*</StatusText>*/}
            </InputWrapper>
            {renderHeading("Sell Fraction Tokens", ExplanationString.sellFractionExplanation)}
            <InputWrapper mt={3}>
              <Flex alignItems="flex-end" width="100%">
                <Field label="What portion would you like to sell?" style={{ flex: 0.2 }}>
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
                <Flex style={{ flex: 1 }} flexWrap="nowrap">
                  <Text mb={28} px={15} fontSize={16}>tokens</Text>
                </Flex>
              </Flex>
            </InputWrapper>
          </>
        )}
        {!!balancerCountValue && (
          <>
            {renderHeading('DAI allowance', ExplanationString.daiAllowanceExplanation )}
            <InputWrapper mt={3}>
              <Flex flexWrap="wrap" width="100%" alignItems="flex-end">
                <Field
                  label="DAI amount (2% of value of tokens being sent to the pool)"
                  style={{ flex: 1 }}
                  pr={4}
                >
                  <Input
                    type="text"
                    required
                    value={daiAmount}
                    width="100%"
                    disabled
                  />
                </Field>
                <Flex style={{ marginBottom: 16, flex: 1 }}>
                  <Button.Outline
                    style={{ flex: 1 }}
                    disabled={unlockDaiButtonDisabled}
                    onClick={() => approveTokenTransaction(daiAmount, getFrackerContractAddress(networkId))}
                  >
                    {(!!gettingDaiAllowance || isDaiAllowanceTransactionPending) && <Loader size={20} />}
                    {!gettingDaiAllowance && !isDaiAllowanceTransactionPending && unlockDaiButtonTitle}
                  </Button.Outline>
                  <DaiIcon size={45} ml={3} />
                </Flex>
              </Flex>
              <StatusText>
                <StatusIcon>
                  {!!daiUnlocked && !isDaiAllowanceTransactionPending && <Icon name="CheckCircle" color="success" size={17} />}
                  {!daiUnlocked && !isDaiAllowanceTransactionPending && <Icon name="Cancel" color="danger" size={17} />}
                  {!daiUnlocked && !!isDaiAllowanceTransactionPending && <Icon name="QueryBuilder" color="blue" size={17} />}
                </StatusIcon>
                {!!daiUnlocked && !isDaiAllowanceTransactionPending && 'Confirmed'}
                {!daiUnlocked && !isDaiAllowanceTransactionPending && 'Unconfirmed'}
                {!daiUnlocked && !!isDaiAllowanceTransactionPending && (
                  <Link color="#605e69" href={getTransactionDetailsLink(daiAllowanceTransaction.hash, networkId)} target="_blank">Pending</Link>
                )}
              </StatusText>
            </InputWrapper>
          </>
        )}
      </FormWrapper>
      <FractionateButton
        selectedNft={selectedNft}
        nftTokenSupplyAmount={Number(fractionCountValue) || 1000}
        nftEstimatedValue={Number(estimatedValue)}
        nftTokenSellAmount={Number(balancerCountValue)}
        minBid={Number(minBid)}
        minBidIncrease={Number(minBidIncrease)}
        auctionDurationSeconds={Number(auctionDurationSeconds)}
        onSuccess={resetForm}
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
  transactions: PropTypes.array,
  balances: PropTypes.arrayOf(PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.number,
  })),
  connectedWalletAddress: PropTypes.string,
  networkId: PropTypes.number,
  approveTokenTransaction: PropTypes.func,
  approveNftTransaction: PropTypes.func,
  removeNftFromWalletAssets: PropTypes.func,
};

const mapStateToProps = ({
  wallet: {
    nftAssets,
    balances,
    connected: { address: connectedWalletAddress, networkId },
  },
  transactions: { data: transactions },
}) => ({
  nftAssets,
  balances,
  transactions,
  connectedWalletAddress,
  networkId,
});

const mapDispatchToProps = {
  approveTokenTransaction: approveTokenTransactionAction,
  approveNftTransaction: approveNftTransactionAction,
  removeNftFromWalletAssets: removeNftFromWalletAssetsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FractionateForm);
