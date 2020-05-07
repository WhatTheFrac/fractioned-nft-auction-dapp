pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./aragon-minime/MiniMeToken.sol";
import "./interfaces/INFTReceiver.sol";
import "./interfaces/ITokenReceiver.sol";

contract Fracker {

    using Address for address;

    struct FrackedToken {
        address nftAddress;
        uint256 nftId;
        address nftReceiver;
        address tokenReceiver;
        address token;
    }

    FrackedToken[] public frackedTokens;

    /**
        @dev Function is public because external gives stack too deep errors
    */
    function fractionalize(
        address _nftAddress,
        uint256 _nftId,
        address _nftReceiver,
        bytes memory _nftReceiverData,
        string memory _tokenName,
        string memory _symbol,
        uint256 _initialSupply,
        address _tokenReceiver,
        bytes memory _tokenReceiverData
    ) public {
        IERC721 nftContract = IERC721(_nftAddress);
        // Pull NFT
        nftContract.transferFrom(msg.sender, address(this), _nftId);
        // Allow NFT contract to pull token
        nftContract.approve(_nftReceiver, _nftId);

        // Create token
        MiniMeToken token = new MiniMeToken(
            address(0), // Not using clone token factory
            address(0), // Not a clone token
            0, // No snapshot block
            _tokenName,
            18,
            _symbol,
            true
        );

        // Set fracked token data
        FrackedToken storage frackedTokenData = frackedTokens.push();
        frackedTokenData.nftAddress = _nftAddress;
        frackedTokenData.nftId = _nftId;
        frackedTokenData.nftReceiver = _nftReceiver;
        frackedTokenData.tokenReceiver = _tokenReceiver;
        frackedTokenData.token = address(token);

        // Mint tokens
        token.generateTokens(address(this), _initialSupply);
        // Approve tokens
        token.approve(_tokenReceiver, uint256(-1));

        // Call Token receiving contract with data payload
        if(_tokenReceiver.isContract()) {
            ITokenReceiver(_tokenReceiver).receiveTokens(frackedTokens.length - 1, address(token), _initialSupply, _tokenReceiverData);
        } else {
            token.transfer(_tokenReceiver, _initialSupply);
        }

        // Call NFT Receiving contract with data payload
        if(_nftReceiver.isContract()) {
            INFTReceiver(_nftReceiver).receiveNFT(frackedTokens.length - 1, address(token), _initialSupply, _nftReceiverData);
        } else {
            token.transfer(_nftReceiver, _nftId);
        }
    }

    // Boiler plate controller methods

    function proxyPayment(address) external payable returns(bool) {return true;}
    function onTransfer(address, address, uint256) external pure returns(bool) {return true;}
    function onApprove(address, address, uint) external pure returns(bool) {return true;}

}