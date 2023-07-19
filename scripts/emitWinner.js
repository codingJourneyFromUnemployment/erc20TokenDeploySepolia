const colors = require('colors');
const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const contractName = 'SquidwardTentaclesToken';
  const contractAddress = '0x9a27F24807b66Ffd80AA37bc19478f42312668f6';
  const spender = '0x873289a1aD6Cf024B927bd13bd183B264d274c68';
  const owner = '0xE084C2D6258bf4F6276849a4c2D4582A16135b99'
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];
  const totalAmount = hre.ethers.parseEther('100');
  const amount = hre.ethers.parseEther('10');
  let eventHandled = false;

  console.log(`Approving ${spender} to spend 100 tokens from ${contractAddress}`.cyan);
  const tokenContract = await hre.ethers.getContractAt(contractName, contractAddress, signer);
  const approveBool = await tokenContract.approve(spender, totalAmount);
  const allowance = await tokenContract.allowance(owner, spender);
  console.log(`Allowance: ${hre.ethers.parseEther(allowance.toString())}`.green);
  
  const contractBucket = 'Bucket'
  const contractBucketAddress = '0x873289a1aD6Cf024B927bd13bd183B264d274c68';
  const bucketContract = await hre.ethers.getContractAt(contractBucket, contractBucketAddress, signer);
  const eventListener = await bucketContract.addListener('Winner',
    (winner) => {
      console.log(`Winner: ${winner}`.bgGreen);
      eventHandled = true;
    }
  );
  console.log('eventListeneradded, start drop.'.green);

  await bucketContract.drop(contractAddress, amount);
  console.log('drop completed.'.green);
  while(!eventHandled) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});