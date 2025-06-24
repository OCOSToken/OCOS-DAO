// deploy_dao.js
// Secure deployment script for OCOS Genesis DAO Contracts

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🔐 Initializing DAO deployment...");

  // Get deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log(`🧾 Deployer: ${deployer.address}`);

  // Deploy OCOS Governance Token
  const Token = await ethers.getContractFactory("OCOSGovernanceToken");
  const token = await Token.deploy("OCOS DAO Token", "OCOS", 18);
  await token.deployed();
  console.log(`✅ Token deployed at: ${token.address}`);

  // Deploy VaultS47 (symbolic BTC reserve)
  const Vault = await ethers.getContractFactory("VaultS47");
  const vault = await Vault.deploy();
  await vault.deployed();
  console.log(`✅ Vault deployed at: ${vault.address}`);

  // Deploy DAO Core Contract
  const GenesisDAO = await ethers.getContractFactory("OCOSGenesisDAO");
  const dao = await GenesisDAO.deploy(token.address, vault.address);
  await dao.deployed();
  console.log(`✅ OCOSGenesisDAO deployed at: ${dao.address}`);

  // Transfer token ownership to DAO
  const tx = await token.transferOwnership(dao.address);
  await tx.wait();
  console.log(`🔁 Token ownership transferred to DAO.`);

  // Initialize Genesis State (optional hash commitment)
  const initHash = ethers.utils.id("OCOS_GENESIS_2025");
  const initTx = await dao.initializeGenesis(initHash);
  await initTx.wait();
  console.log(`🌱 DAO Genesis initialized with hash commitment.`);

  console.log("🚀 Deployment Complete.");
}

main().catch((error) => {
  console.error("🚨 Deployment failed:", error);
  process.exit(1);
});
