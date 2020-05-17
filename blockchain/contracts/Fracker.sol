pragma solidity 0.6.4;
// pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pie-dao/proxy/contracts/PProxy.sol";
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

contract Fracker is ReentrancyGuard {
    using Address for address;

    uint256 public constant BALANCER_98 = 49 * 10 ** 18;
    uint256 public constant BALANCER_2 = 1 * 10 ** 18;
    uint256 public constant BALANCER_100 = 50 * 10 ** 18;

    address tokenImplementation;

    IERC20 public DAI;

    struct FrackedToken {
        IERC721 nftContract;
        uint256 nftId;
        address nftReceiver;
        address fracker; //address that fracked the token set to 0x0000 after settlement
        uint256 frackTime; // timestamp when token was fracked
        MiniMeToken token;
        IBPool balancerPool;
        uint256 balancerFlipDuration;
        uint256 minAuctionBid;
        uint256 minBidIncrease;
        uint256 auctionDuration;
        address lastBidder;
        uint256 lastBid;
        // bool settled;
    }

    FrackedToken[] public frackedTokens;
    IBFactory public balancerFactory;

    constructor(address _balancerFactory, address _DAI) public {
        balancerFactory = IBFactory(_balancerFactory);
        tokenImplementation = address(new MiniMeToken());
        DAI = IERC20(_DAI);
    }

    /**
        @dev Function is public because external gives stack too deep errors
    */
    function fractionalize(
        address _nftAddress,
        uint256 _nftId,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _amountToPool,
        // address _poolToken, // e.g DAI
        uint256 _targetPrice, // estimated value of nft
        uint256 _balancerFlipDuration, // How long it takes to flip the weight
        // uint256 _auctionToken,
        uint256 _minAuctionBid,
        uint256 _minBidIncrease,
        uint256 _auctionDuration
    ) public nonReentrant {
        require(_amountToPool <= _initialSupply, "Cannot pool more than initialSupply");
        require(_initialSupply != 0, "_initialSupply cannot be zero");
        require(_auctionDuration >  _balancerFlipDuration, "Balancer needs to flip before the end of the auction");

        {
            IERC721 nftContract = IERC721(_nftAddress);
            // Pull NFT, does not return anything according to ERC721 SPEC
            nftContract.transferFrom(msg.sender, address(this), _nftId);
        }


        MiniMeToken token;
        {
            PProxy proxy = new PProxy();
            proxy.setImplementation(tokenImplementation);
            // Create token
            token = MiniMeToken(address(proxy));
        }

        {
            token.init(
                address(0),
                address(0),
                0,
                _symbol,
                uint8(18),
                _symbol,
                true
            );
        }
        // Set fracked token data
        FrackedToken storage frackedTokenData = frackedTokens.push();
        frackedTokenData.token = token;

        {
            frackedTokenData.nftContract = IERC721(_nftAddress);
            frackedTokenData.nftId = _nftId;
            // frackedTokenData.poolToken = IERC20(_poolToken);
            frackedTokenData.frackTime = block.timestamp;
            frackedTokenData.balancerFlipDuration = _balancerFlipDuration;
            frackedTokenData.fracker = msg.sender;
            // frackedTokenData.auctionToken = IERC20(_auctionToken);
            frackedTokenData.minAuctionBid = _minAuctionBid;
            frackedTokenData.minBidIncrease = _minBidIncrease;
            frackedTokenData.auctionDuration = _auctionDuration;
        }

        // Mint tokens
        token.generateTokens(address(this), _initialSupply);

        if(_amountToPool != 0) {
            // Copy to memory to save gas on storage reads
            IBPool balancerPool = IBPool(balancerFactory.newBPool());
            frackedTokenData.balancerPool = balancerPool;

            // TODO handle partial pooling

            // // // Bind fraction token
            token.approve(address(balancerPool), _amountToPool);
            balancerPool.bind(address(token), _amountToPool, BALANCER_98);

            // // Amount of pool token should be 2%
            uint256 poolTokenAmount = _targetPrice * _amountToPool / _initialSupply * 2 / 100;
            // // Bind other token
            DAI.transferFrom(msg.sender, address(this), poolTokenAmount);
            DAI.approve(address(balancerPool), poolTokenAmount);
            balancerPool.bind(address(DAI), poolTokenAmount, BALANCER_2);
            balancerPool.setPublicSwap(true);
        }

        if(_amountToPool != _initialSupply) {
            token.transfer(msg.sender, _initialSupply - _amountToPool);
        }


    }

    // Pokes the balancer weights
    function poke(uint256 _frackID) external nonReentrant {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];


        uint256 weightDifference = BALANCER_98 - BALANCER_2;
        uint256 timePassed = block.timestamp - frackedTokenData.frackTime;
        uint256 newWeightA = BALANCER_2 + weightDifference * timePassed / frackedTokenData.balancerFlipDuration;
        uint256 newWeightB = BALANCER_100 - newWeightA;

        MiniMeToken tokenA = frackedTokenData.token;

        frackedTokenData.balancerPool.rebind(address(tokenA), frackedTokenData.balancerPool.getBalance(address(tokenA)), newWeightA);
        frackedTokenData.balancerPool.rebind(address(DAI), frackedTokenData.balancerPool.getBalance(address(DAI)), newWeightB);
    }


    // Claim proceeds of user
    function claimProceeds(uint256 _frackID, address _user) public nonReentrant {
        _claimProceeds(_frackID, _user);
    }

    function _claimProceeds(uint256 _frackID, address _user) internal {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];
        require(frackedTokenData.fracker == address(0), "Must be settled");

        MiniMeToken fracToken = frackedTokenData.token;

        uint256 burnAmount = fracToken.balanceOf(_user);
        // If user has 0 tokens return
        if(burnAmount == 0) {
            return;
        }

        uint256 payoutAmount = frackedTokenData.lastBid * burnAmount / fracToken.totalSupply();
        frackedTokenData.lastBid = payoutAmount;

        DAI.transfer(_user, payoutAmount);
        fracToken.destroyTokens(_user, burnAmount);
    }

    // TODO catch revert on failure to send
    // Remove liquidity from balancer pool, claim proceeds and send tokens back to user, and send nft to buyer
    function settle(uint256 _frackID) public nonReentrant {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];
        require(block.timestamp > frackedTokenData.frackTime + frackedTokenData.auctionDuration, "Auction not passed");
        require(frackedTokenData.fracker != address(0), "Already settled");

        MiniMeToken fracToken = frackedTokenData.token;

        // Get balance before (reusing variables later)
        uint256 fracTokenAmount = fracToken.balanceOf(address(this));
        uint256 poolTokenAmount = DAI.balanceOf(address(this));

        // Unbind tokens in balancer pool
        frackedTokenData.balancerPool.unbind(address(DAI));
        frackedTokenData.balancerPool.unbind(address(frackedTokenData.token));

        // Calc amount from balancer pool
        fracTokenAmount = fracToken.balanceOf(address(this)) - fracTokenAmount;
        poolTokenAmount = DAI.balanceOf(address(this)) - poolTokenAmount;

        address fracker = frackedTokenData.fracker;

        // Send tokens to fracker
        fracToken.transfer(fracker, fracTokenAmount);
        DAI.transfer(fracker, poolTokenAmount);

        // Set settled
        frackedTokenData.fracker = address(0);
        // Claim proceeds of fracked token
        _claimProceeds(_frackID, fracker);

        // Send NFT to winner
        frackedTokenData.nftContract.transferFrom(address(this), frackedTokenData.lastBidder, frackedTokenData.nftId);
    }

    // TODO catch transfer failure
    function bid(uint256 _frackID, uint256 _amount) external nonReentrant {
        FrackedToken storage frackedTokenData = frackedTokens[_frackID];
        require(block.timestamp < frackedTokenData.frackTime + frackedTokenData.auctionDuration, "Auction has passed");
        require(_amount > frackedTokenData.minAuctionBid, "Bid too low");
        require(_amount > frackedTokenData.lastBid + (frackedTokenData.lastBid * frackedTokenData.minBidIncrease / 1000), "Bid increase too low");

        if(frackedTokenData.lastBidder != address(0)) {
            // Send back previous bid to previous bidder
            DAI.transfer(frackedTokenData.lastBidder, frackedTokenData.lastBid);
        }

        // Pull new bid
        require(DAI.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        frackedTokenData.lastBid = _amount;
        frackedTokenData.lastBidder = msg.sender;
    }

    // Boiler plate controller methods
    function proxyPayment(address) external payable returns(bool) {return true;}
    function onTransfer(address, address, uint256) external pure returns(bool) {return true;}
    function onApprove(address, address, uint) external pure returns(bool) {return true;}

}