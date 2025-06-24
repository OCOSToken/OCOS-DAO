// batch_vault_status.js
// Description: Retrieves and displays the status of multiple vaults from the VaultS47 contract

require("dotenv").config();
const { ethers } = require("hardhat");

const vaultContractAddress = "0xVaultS47ContractAddress"; // replace with deployed contract address
const vaultABI = [
  // Minimal ABI for vault status check
  "function getVaultStatus(uint256 index) public view returns (bool)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const vault = new ethers.Contract(vaultContractAddress, vaultABI, signer);

  const startIndex = 0;
  const endIndex = 100; // Adjust range as needed (e.g., 0–47000)

  console.log(`\n🔍 Checking vault status from index ${startIndex} to ${endIndex - 1}...\n`);

  for (let i = startIndex; i < endIndex; i++) {
    try {
      const isClaimed = await vault.getVaultStatus(i);
      console.log(`Vault #${i.toString().padStart(5, '0')} → Status: ${isClaimed ? "✅ Claimed" : "🔒 Unclaimed"}`);
    } catch (error) {
      console.error(`Vault #${i}: ❌ Error → ${error.message}`);
    }
  }

  console.log("\n✅ Vault batch status check completed.\n");
}

main().catch((error) => {
  console.error("⛔ Script execution failed:", error);
  process.exit(1);
});
