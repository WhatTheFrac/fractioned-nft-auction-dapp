pragma solidity ^0.6.4;

interface INFTReceiver {
    function receiveNFT(address _nftAddress, uint256 _nftId, bytes calldata _data) external;
}