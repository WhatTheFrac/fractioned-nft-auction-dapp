pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/** @dev
    DO NOT USE WITH ERC777 like tokens where receivers can reject receiving of tokens
    We can try to use try-catch to handle this
*/

contract NftAuction {

    uint256 public expiration;
    uint256 public constant bidTimeout = 1 days;
    uint256 public nftId;
    address public lastBidder;
    uint256 public lastBidTimestamp;
    address public payoutAddress;

    IERC721 public nftToken;
    IERC20 public token;

    bool public initialized;

    function init(uint256 _expiration, uint256 _nftId, address _nftToken, address _payoutAddress, address _token) external {
        require(!initialized, "Already initialized");
        initialized = true;
        expiration = _expiration;
        nftId = _nftId;
        nftToken = IERC721(_nftToken);
        payoutAddress = _payoutAddress;
        token = IERC20(_token);

        nftToken.transferFrom(msg.sender, address(this), _nftId);
    }

    function bid(uint256 _amount) external {
        require(_amount > token.balanceOf(address(this)), "Bid needs to increase");
        // require(_amount != 0, "No zero bids"); //enforced by amount check above
        // No previous bid or not expired or last bid can still be overbid.
        require(
            lastBidTimestamp == 0 ||
            block.timestamp < expiration ||
            block.timestamp < lastBidTimestamp + bidTimeout,
            "Cannot bid anymore"
        );

        // Transfer back funds to previous bidder if any
        if(lastBidder != address(0)) {
            token.transfer(lastBidder, token.balanceOf(address(this)));
        }

        require(token.transferFrom(msg.sender, address(this), _amount), "TransferFrom failed");

        lastBidder = msg.sender;
        lastBidTimestamp = block.timestamp;
    }

    function settle() external {
        require(
            block.timestamp > expiration &&
            block.timestamp > lastBidTimestamp + bidTimeout,
            "Auction not expired yet"
        );

        // Payout proceeds
        token.transfer(payoutAddress, token.balanceOf(address(this)));
        // TODO check for possible DOS where receiver blocks nft receiving
        // Send nft to winning bidder
        nftToken.transferFrom(address(this), lastBidder, nftId);
    }

}