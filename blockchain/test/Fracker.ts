import { ethers } from "@nomiclabs/buidler";
import { Signer, Wallet, utils, constants } from "ethers";
import { BigNumber, parseEther, bigNumberify } from "ethers/utils";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";

import { Fracker } from "../typechain/Fracker";
import FrackerArtifact from "../artifacts/Fracker.json";
import { MockERC721Factory } from "../typechain/MockERC721Factory";
import { MockERC721 } from "../typechain/MockERC721";
import { IERC20Factory } from "../typechain/IERC20Factory";
import { IERC721Factory } from "../typechain/IERC721Factory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { deployBalancerFactory } from "../utils";

chai.use(solidity);
const { expect } = chai;

let signers:Signer[];
let account: string;
let account2: string;
let fracker: Fracker;
let nft: MockERC721;
let mockToken: MockToken;

describe("Fracker", function() {
    before(async() => {
        signers = await ethers.signers();
        account = await signers[0].getAddress();
        account2 = await signers[1].getAddress();
    });

    beforeEach(async() => {
        mockToken = await (new MockTokenFactory(signers[0])).deploy("DAI", "DAI", 18);
        await mockToken.mint(account, constants.WeiPerEther.mul(1000000));
        nft = await (new MockERC721Factory(signers[0])).deploy("WTF", "WTF");
        await nft.mint(account, 10);
        const balancerFactoryAddress = await deployBalancerFactory(signers[0]);
        fracker = await deployContract(signers[0] as Wallet, FrackerArtifact, [balancerFactoryAddress, mockToken.address], {gasLimit: 100000000}) as Fracker;
        await nft.setApprovalForAll(fracker.address, true);
        await mockToken.approve(fracker.address, constants.MaxUint256);
    });

    describe("fractionalize", async() => {
        it("Should work", async() => {
            const testSymbol = "TESTSYMBOL";
            const initialSupply = parseEther("1000000");
            const oneDay = new BigNumber(60 * 60 * 24);

            const tx = await fracker.fractionalize(
                nft.address,
                0,
                testSymbol,
                initialSupply,
                parseEther("1"),
                parseEther("1"),
                oneDay,
                parseEther("0.1"),
                parseEther("0.01"),
                oneDay.mul(2)
            );
            console.log((await tx.wait(1)).gasUsed.toString());
        });
        // it("Fractionalizing an NFT sending the token and NFT to an EOA should work", async() => {
        //     const tx = await fracker.fractionalize("TEST", "TEST", constants.WeiPerEther, mockToken.address, constants.WeiPerEther.mul(100), {gasLimit: 100000000});
        //     console.log((await tx.wait(1)).gasUsed.toString());
        //     const frackedTokenData = await fracker.frackedTokens(0);
        //     const token = IERC721Factory.connect(frackedTokenData.token, signers[0]);
        //     const tokenBalance = await token.balanceOf(account2);

        //     expect(tokenBalance).to.eq(constants.WeiPerEther);
        //     // expect(nftOwner).to.eq(account2);
        // });
    });
});