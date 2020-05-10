import ethers from "ethers";
import balancerFactoryBytecode from "./balancerFactoryBytecode";

export const deployBalancerFactory = async(signer: ethers.Signer) => {
    const tx = (await signer.sendTransaction({data: balancerFactoryBytecode})) as any;
    return tx.creates;
}