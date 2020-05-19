const getDaiAddress = () => {
  switch (process.env.BUIDLER_NETWORK) {
    case 'mainnet': return process.env.MAINNET_DAI_ADDRESS;
    case 'rinkeby': return process.env.RINKEBY_DAI_ADDRESS;
    default: return null;
  }
};

const getBalancerFactoryAddress = () => {
  switch (process.env.BUIDLER_NETWORK) {
    case 'mainnet': return process.env.MAINNET_BALANCER_ADDRESS;
    case 'rinkeby': return process.env.RINKEBY_BALANCER_ADDRESS;
    default: return null;
  }
};

const deploy = async () => {
  const daiAddress = getDaiAddress();
  if (!daiAddress) throw Error('Cannot find DAI address!');
  const balancerFactoryAddress = getBalancerFactoryAddress();
  if (!balancerFactoryAddress) throw Error('Cannot find Balancer factory address!');
  const Fracker = await ethers.getContractFactory('Fracker');
  const frackerContract = await Fracker.deploy(balancerFactoryAddress, daiAddress);
  await frackerContract.deployed();
  console.log(`Fracker deployed to: ${frackerContract.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
