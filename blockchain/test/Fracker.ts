import { ethers } from "@nomiclabs/buidler";
import { Signer, Wallet, utils, constants } from "ethers";
import { BigNumber } from "ethers/utils";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";

import { Fracker } from "../typechain/Fracker";
import FrackerArtifact from "../artifacts/Fracker.json";

chai.use(solidity);
const { expect } = chai;

let signers:Signer[];
let account: string;
let fracker: Fracker;

describe("Fracker", function() {
    before(async() => {
        signers = await ethers.signers();
        account = await signers[0].getAddress();
    });

    beforeEach(async() => {
        fracker = await deployContract(signers[0] as Wallet, FrackerArtifact, [], {gasLimit: 100000000}) as Fracker;
    });

    describe("fractionalize", async() => {
        it("Fracttionalizing an NFT sending the token and NFT to an EOA should work", async() => {
            // TODO actual testing
        });
    });
});