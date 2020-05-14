pragma solidity 0.6.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./aragon-minime/MiniMeToken.sol";
import "./interfaces/IBFactory.sol";
import "./interfaces/INFTReceiver.sol";
import "./interfaces/ITokenReceiver.sol";
import "./interfaces/IBPool.sol";


// TODO consider making fracked token position an nft by itself 🤯

// TODO safeMath
// TODO Reentry protection
// TODO catching revert on transfers (anti DOS)
// TODO consider removing min bid 
// TODO incentives for calling settle() and claimProceeds()
// TODO ClaimProceeds

contract Fracker {
    using Address for address;

    uint256 public constant BALANCER_98 = 49 * 10 ** 18;
    uint256 public constant BALANCER_2 = 1 * 10 ** 18;
    uint256 public constant BALANCER_100 = 50 * 10 ** 18;

    struct FrackedToken {
        IERC721 nftContract;
        uint256 nftId;
        address nftReceiver;
        address fracker; //address that fracked the token
        uint256 frackTime; // timestamp when token was fracked
        IERC20 token;
        IERC20 poolToken;
        IBPool balancerPool;
        uint256 balancerFlipDuration;
        IERC20 auctionToken;
        // uint256 minAuctionBid;
        uint256 minBidIncrease;
        uint256 auctionDuration;
        address lastBidder;
        uint256 lastBid;
        // bool settled;
    }

    FrackedToken[] public frackedTokens;
    IBFactory public balancerFactory;

    constructor(address _balancerFactory) public {
        balancerFactory = IBFactory(_balancerFactory);
    }

    /**
        @dev Function is public because external gives stack too deep errors
    */
    function fractionalize(
        address _nftAddress,
        uint256 _nftId,
        string memory _tokenName,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _amountToPool,
        address _poolToken, // e.g DAI
        uint256 _targetPrice, // estimated value of nft
        uint256 _balancerFlipDuration, // How long it takes to flip the weight
        uint256 _auctionToken,
        // uint256 _minAuctionBid,
        uint256 _minBidIncrease,
        uint256 _auctionDuration
    ) public {
        require(_amountToPool <= _initialSupply, "Cannot pool more than initialSupply");
        require(_initialSupply != 0, "_initialSupply cannot be zero");
        require(_auctionDuration >  _balancerFlipDuration, "Balancer needs to flip before the end of the auction");

        IERC721 nftContract = IERC721(_nftAddress);
        // Pull NFT, does not return anything according to ERC721 SPEC
        nftContract.transferFrom(msg.sender, address(this), _nftId);
        // Allow NFT contract to pull token
        // nftContract.approve(_nftReceiver, _nftId);

        // TODO consider using proxy to save gas.
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
        frackedTokenData.token = IERC20(address(token));
        frackedTokenData.nftContract = IERC721(_nftAddress);
        frackedTokenData.nftId = _nftId;
        frackedTokenData.poolToken = IERC20(_poolToken);
        frackedTokenData.frackTime = block.timestamp;
        frackedTokenData.balancerFlipDuration = _balancerFlipDuration;
        frackedTokenData.fracker = msg.sender;
        frackedTokenData.auctionToken = IERC20(_auctionToken);
        // frackedTokenData.minAuctionBid = _minAuctionBid;
        frackedTokenData.minBidIncrease = _minBidIncrease;
        frackedTokenData.auctionDuration = _auctionDuration;

        // Mint tokens
        token.generateTokens(address(this), _initialSupply);

        // Copy to memory to save gas on storage reads
        IBPool balancerPool = IBPool(balancerFactory.newBPool());
        frackedTokenData.balancerPool = balancerPool;

        // // Bind fraction token
        token.approve(address(balancerPool), _initialSupply);
        balancerPool.bind(address(token), _initialSupply, BALANCER_98);

        // Amount of pool token should be 2%
        uint256 poolTokenAmount = _targetPrice * 2 / 100;
        IERC20 poolToken = IERC20(_poolToken);
        // Bind other token
        poolToken.transferFrom(msg.sender, address(this), poolTokenAmount);
        poolToken.approve(address(balancerPool), poolTokenAmount);
        balancerPool.bind(address(poolToken), poolTokenAmount, BALANCER_2);
        balancerPool.setPublicSwap(true);

    }


    // Pokes the balancer weights
    function poke(uint256 _frackID) external {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];


        uint256 weightDifference = BALANCER_98 - BALANCER_2;
        uint256 timePassed = block.timestamp - frackedTokenData.frackTime;
        uint256 newWeightA = BALANCER_2 + weightDifference * timePassed / frackedTokenData.balancerFlipDuration;
        uint256 newWeightB = BALANCER_100 - newWeightA;

        IERC20 tokenA = frackedTokenData.token;
        IERC20 tokenB = frackedTokenData.poolToken;

        frackedTokenData.balancerPool.rebind(address(tokenA), frackedTokenData.balancerPool.getBalance(address(tokenA)), newWeightA);
        frackedTokenData.balancerPool.rebind(address(tokenB), frackedTokenData.balancerPool.getBalance(address(tokenB)), newWeightB);
    }


    // Claim proceeds of user
    function claimProceeds(uint256 _frackID, address _user) public {

    }

    // TODO catch revert on failure to send
    // Remove liquidity from balancer pool, claim proceeds and send tokens back to user, and send nft to buyer
    function settle(uint256 _frackID) public {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];
        require(block.timestamp > frackedTokenData.frackTime + frackedTokenData.auctionDuration, "Auction not passed");

        IERC20 fracToken = frackedTokenData.token;
        IERC20 poolToken = frackedTokenData.poolToken;

        // Get balance before (reusing variables later)
        uint256 fracTokenAmount = fracToken.balanceOf(address(this));
        uint256 poolTokenAmount = poolToken.balanceOf(address(this));

        // Unbind tokens in balancer pool
        frackedTokenData.balancerPool.unbind(address(frackedTokenData.poolToken));
        frackedTokenData.balancerPool.unbind(address(frackedTokenData.token));

        // Calc amount from balancer pool
        fracTokenAmount = fracToken.balanceOf(address(this)) - fracTokenAmount;
        poolTokenAmount = poolToken.balanceOf(address(this)) - poolTokenAmount;

        address fracker = frackedTokenData.fracker;

        // Send tokens to fracker
        fracToken.transfer(fracker, fracTokenAmount);
        poolToken.transfer(fracker, poolTokenAmount);

        // Claim proceeds of fracked token
        claimProceeds(_frackID, fracker);

        // Send NFT to winner
        frackedTokenData.nftContract.transferFrom(address(this), frackedTokenData.lastBidder, frackedTokenData.nftId);
    }

    // TODO catch transfer failure
    function bid(uint256 _frackID, uint256 _amount) external {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];
        require(block.timestamp < frackedTokenData.frackTime + frackedTokenData.auctionDuration, "Auction has passed");
        // require(_amount > frackedTokenData.minAuctionBid, "Bid too low");
        require(_amount > frackedTokenData.lastBid + frackedTokenData.minBidIncrease, "Bid increase too low");

        if(frackedTokenData.lastBidder != address(0)) {
            // Send back previous bid to previous bidder
            frackedTokenData.auctionToken.transfer(frackedTokenData.lastBidder, frackedTokenData.lastBid);
        }

        // Pull new bid
        require(frackedTokenData.auctionToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        frackedTokenData.lastBid = _amount;
        frackedTokenData.lastBidder = msg.sender;
    }

    // Boiler plate controller methods
    function proxyPayment(address) external payable returns(bool) {return true;}
    function onTransfer(address, address, uint256) external pure returns(bool) {return true;}
    function onApprove(address, address, uint) external pure returns(bool) {return true;}

}