// scripts/deploy.js

/**
 * Deploy OCOS-DAO S47 Protocol contracts to selected EVM network.
 * Usage: npx hardhat run scripts/deploy.js --network <networkName>
 */

const hre = require("hardhat");

async function main() {
  // Deploy OCOS Token (send all supply to deployer or DAO Treasury)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy OcosToken contract
  const OcosToken = await hre.ethers.getContractFactory("OcosToken");
  const ocosToken = await OcosToken.deploy(deployer.address); // or DAO treasury address
  await ocosToken.deployed();
  console.log("OCOS Token deployed to:", ocosToken.address);

  // Deploy S47DaoVault contract
  const S47DaoVault = await hre.ethers.getContractFactory("S47DaoVault");
  const daoVault = await S47DaoVault.deploy(ocosToken.address);
  await daoVault.deployed();
  console.log("S47 DAO Vault deployed to:", daoVault.address);

  // Optional: Save addresses to frontend .env or config file
  // ... add fs logic if needed
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
