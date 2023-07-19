const colors = require('colors');
const hre = require('hardhat');
require('dotenv').config();

async function main() {
  console.log('deploying...'.yellow);
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  
  if(hre.network.name === 'localhost') {
    console.log('Deploying to local network'.cyan);
  } else {
    console.log(`Deploying to ${hre.network.name}`.cyan);
  }

  const provider = new hre.ethers.JsonRpcProvider(hre.network.config.url);
  const maxFeePerGas = await (await provider.getFeeData()).maxFeePerGas;
  console.log(`maxFeePerGas: ${maxFeePerGas.toString()}`.green);

  const Token = await hre.ethers.getContractFactory("SquidwardTentaclesToken", deployer);
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log(`Token deployed to: ${await token.getAddress()}`.green);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});