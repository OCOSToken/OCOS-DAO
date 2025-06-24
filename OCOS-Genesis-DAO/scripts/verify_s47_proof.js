// verify_s47_proof.js
// Verifies an S47 (BTC-style) ownership proof using S47ProofVerifier contract

require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Starting S47 ownership proof verification...");

  const [signer] = await ethers.getSigners();
  console.log(`🧾 Using wallet: ${signer.address}`);

  // Load S47ProofVerifier contract
  const verifierAddress = process.env.S47_VERIFIER_ADDRESS;
  const verifier = await ethers.getContractAt("S47ProofVerifier", verifierAddress, signer);

  // Load proof data from file or input (for demo, hardcoded here)
  const message = "I confirm ownership of S47 address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
  const btcAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

  // Load or paste base64 signature (must be converted to hex string)
  const signatureHex = process.env.S47_SIGNATURE_HEX;
  if (!signatureHex) {
    console.error("❌ No signature provided. Please set S47_SIGNATURE_HEX in .env file.");
    process.exit(1);
  }

  const signatureBytes = ethers.utils.arrayify(signatureHex);

  console.log("🛠️ Submitting proof to contract...");
  const tx = await verifier.verifyS47Proof(message, signatureBytes, btcAddress);
  await tx.wait();

  console.log("✅ Proof successfully verified and logged on-chain.");
}

main().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exit(1);
});
