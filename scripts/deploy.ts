import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);

  const initialSupply = ethers.parseEther('1000000');
  const RewardToken = await ethers.getContractFactory('BaseRewardToken');
  const rewardToken = await RewardToken.deploy(initialSupply);

  await rewardToken.waitForDeployment();

  console.log('BaseRewardToken deployed to:', rewardToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
