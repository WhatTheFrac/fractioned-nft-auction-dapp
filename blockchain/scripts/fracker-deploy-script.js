const deploy = async () => {
  const Fracker = await ethers.getContractFactory('Fracker');
  const frackerContract = await Fracker.deploy();
  await frackerContract.deployed();
  console.log(`Fracker deployed to: ${frackerContract.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
