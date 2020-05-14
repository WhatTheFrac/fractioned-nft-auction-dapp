pragma solidity 0.6.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./aragon-minime/MiniMeToken.sol";
import "./interfaces/IBFactory.sol";
import "./interfaces/INFTReceiver.sol";
import "./interfaces/ITokenReceiver.sol";
import "./interfaces/IBPool.sol";


//TODO consider making fracked token position an nft by itself 🤯

contract Fracker {
    using Address for address;

    uint256 public constant BALANCER_98 = 49 * 10 ** 18;
    uint256 public constant BALANCER_2 = 1 * 10 ** 18;
    uint256 public constant BALANCER_100 = 50 * 10 ** 18;

    struct FrackedToken {
        // address nftAddress;
        // uint256 nftId;
        // address nftReceiver;
        address fracker; //address that fracked the token
        uint256 frackTime; // timestamp when token was fracked
        IERC20 token;
        IBPool balancerPool;
        uint256 balancerFlipDuration;
        IERC20 auctionToken;
        uint256 minAuctionBid;
        uint256 minBidIncrease;
        uint256 auctionDuration;
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
        uint256 _minAuctionBid,
        uint256 _minBidIncrease,
        uint256 _auctionDuration,

        // Auction data
        address lastBidder,
        address lastBid,

        bool settled
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
        frackedTokenData.token = address(token);
        frackedTokenData.frackTime = block.timestamp;
        frackedTokenData.balancerFlipDuration = _balancerFlipDuration;
        frackedTokenData.fracker = msg.sender;
        frackedTokenData.auctionToken = _auctionToken;
        frackedTokenData.minAuctionBid = _minAuctionBid;
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

        frackedTokenData.balancerPool.rebind(address(tokenA), frackedTokenData.getBalance(address(tokenA)), newWeightA);
        frackedTokenData.balancerPool.rebind(address(tokenB), frackedTokenData.getBalance(address(tokenB)), newWeightB);
    }

    // Claim the nft after auction finished
    function claimNFT(uint256 _frackID) external {

    }

    // Claim proceeds of user
    function claimProceeds(uint256 _frackID, address _user) external {

    }

    // Remove liquidity from balancer pool, claim proceeds and send tokens back to user
    function settle(uint256 _frackID) external {
        
    }

    function bid(uint256 _frackID, uint256 _amount) external {

    }

    // Boiler plate controller methods
    function proxyPayment(address) external payable returns(bool) {return true;}
    function onTransfer(address, address, uint256) external pure returns(bool) {return true;}
    function onApprove(address, address, uint) external pure returns(bool) {return true;}

}