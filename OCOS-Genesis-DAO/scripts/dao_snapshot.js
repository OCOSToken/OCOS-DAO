// dao_snapshot.js
// Fetches DAO token balances at a specific block height for snapshot-based voting

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const snapshotBlock = parseInt(process.env.SNAPSHOT_BLOCK || "0");
  const tokenAddress = process.env.GOVERNANCE_TOKEN_ADDRESS;
  const holders = process.env.TOKEN_HOLDERS.split(",");

  if (!snapshotBlock || !tokenAddress || holders.length === 0) {
    console.error("❌ Environment variables missing. Please set SNAPSHOT_BLOCK, GOVERNANCE_TOKEN_ADDRESS, TOKEN_HOLDERS");
    process.exit(1);
  }

  const Token = await ethers.getContractAt("OCOSGovernanceToken", tokenAddress);
  console.log(`📦 Snapshot at block: ${snapshotBlock}`);

  const snapshotResults = [];

  for (const holder of holders) {
    try {
      const balance = await Token.balanceOf(holder, { blockTag: snapshotBlock });
      const formatted = ethers.utils.formatUnits(balance, 18);
      snapshotResults.push({ holder, balance: formatted });
      console.log(`✅ ${holder}: ${formatted} tokens`);
    } catch (err) {
      console.error(`⚠️  Error fetching balance for ${holder}:`, err);
    }
  }

  console.log("\n🗳️ DAO Snapshot Results:");
  console.table(snapshotResults);
}

main().catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
});
