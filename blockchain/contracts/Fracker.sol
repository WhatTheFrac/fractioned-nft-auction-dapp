pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./aragon-minime/MiniMeToken.sol";
import "./interfaces/INFTReceiver.sol";
import "./interfaces/ITokenReceiver.sol";

contract Fracker {

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

        // Mint tokens
        token.generateTokens(address(this), _initialSupply);
        // Approve tokens
        token.approve(_tokenReceiver, uint256(-1));

        // Call Token receiving contract with data payload
        ITokenReceiver(_tokenReceiver).receiveTokens(address(token), _initialSupply, _tokenReceiverData);
        // Call NFT Receiving contract with data payload
        INFTReceiver(_nftReceiver).receiveNFT(address(token), _initialSupply, _nftReceiverData);
    }

    // Boiler plate controller methods

    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) external payable returns(bool) {return true;}

    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) external returns(bool) {return true;}

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) external returns(bool) {return true;}

}