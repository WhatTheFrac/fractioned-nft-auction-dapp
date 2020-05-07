import { ethers } from "@nomiclabs/buidler";
import { Signer, Wallet, utils, constants } from "ethers";
import { BigNumber } from "ethers/utils";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";

import { Fracker } from "../typechain/Fracker";
import FrackerArtifact from "../artifacts/Fracker.json";
import { MockERC721Factory } from "../typechain/MockERC721Factory";
import { MockERC721 } from "../typechain/MockERC721";
import { IERC20Factory } from "../typechain/IERC20Factory";
import { IERC721Factory } from "../typechain/IERC721Factory";

chai.use(solidity);
const { expect } = chai;

let signers:Signer[];
let account: string;
let account2: string;
let fracker: Fracker;
let nft: MockERC721;

describe("Fracker", function() {
    before(async() => {
        signers = await ethers.signers();
        account = await signers[0].getAddress();
        account2 = await signers[1].getAddress();
    });

    beforeEach(async() => {
        nft = await (new MockERC721Factory(signers[0])).deploy("WTF", "WTF");
        await nft.mint(account, 10);
        fracker = await deployContract(signers[0] as Wallet, FrackerArtifact, [], {gasLimit: 100000000}) as Fracker;
        await nft.setApprovalForAll(fracker.address, true);
    });

    describe("fractionalize", async() => {
        it("Fractionalizing an NFT sending the token and NFT to an EOA should work", async() => {
            await fracker.fractionalize(nft.address, 0, account2, "0x00", "WTFF TOKEN", "WTF", constants.WeiPerEther, account2, "0x00");

            const nftOwner = await nft.ownerOf(0);
            const frackedTokenData = await fracker.frackedTokens(0);
            const token = IERC721Factory.connect(frackedTokenData.token, signers[0]);
            const tokenBalance = await token.balanceOf(account2);

            expect(tokenBalance).to.eq(constants.WeiPerEther);
            expect(nftOwner).to.eq(account2);
        });
    });
});