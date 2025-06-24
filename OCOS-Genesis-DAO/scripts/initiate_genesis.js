// initiate_genesis.js
// Triggers the OCOS Genesis Initialization Hash on-chain

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🌐 Starting OCOS Genesis Initialization...");

  // Load deployer wallet
  const [signer] = await ethers.getSigners();
  console.log(`🔑 Signer: ${signer.address}`);

  // DAO contract address (must be updated post-deployment)
  const daoAddress = "0xDeployedOCOSGenesisDAOAddress";
  const GenesisDAO = await ethers.getContractAt("OCOSGenesisDAO", daoAddress, signer);

  // Genesis Proof Commitment (same used during deploy for consistency)
  const genesisCommit = ethers.utils.id("OCOS_GENESIS_2025");
  console.log(`🧬 Hash Commitment: ${genesisCommit}`);

  // Execute genesis activation
  const tx = await GenesisDAO.initializeGenesis(genesisCommit);
  await tx.wait();

  console.log("✅ Genesis successfully initialized!");
}

main().catch((error) => {
  console.error("🚨 Genesis initialization failed:", error);
  process.exit(1);
});
