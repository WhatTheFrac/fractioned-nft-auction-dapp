pragma solidity ^0.6.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {

    uint256 nftCounter;

    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) public {

    }

    function mint(address _to, uint256 _amount) external {
        for(uint256 i = 0; i < _amount; i ++) {
            _mint(_to, nftCounter);
            nftCounter ++;
        }
    }
}