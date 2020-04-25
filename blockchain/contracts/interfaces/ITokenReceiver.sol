pragma solidity ^0.6.4;

interface ITokenReceiver {
    function receiveTokens(address _token, uint256 _amount, bytes calldata _data) external;
}