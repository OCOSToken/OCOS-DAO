// vote_session.js
// Casts and monitors vote on OCOS Genesis DAO proposals

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🗳️  Initiating OCOS DAO Vote Session...");

  const [voter] = await ethers.getSigners();
  console.log(`🧾 Voter Address: ${voter.address}`);

  // DAO Contract Address
  const daoAddress = "0xYourDeployedOCOSGenesisDAOAddress";
  const GenesisDAO = await ethers.getContractAt("OCOSGenesisDAO", daoAddress, voter);

  // Proposal ID to vote on (usually emitted when submitted)
  const proposalId = 1; // replace with your actual proposalId

  // Vote choice (true = Yes / support, false = No / oppose)
  const support = true;

  console.log(`📦 Submitting vote for proposal ID ${proposalId}...`);
  const voteTx = await GenesisDAO.castVote(proposalId, support);
  await voteTx.wait();
  console.log("✅ Vote successfully casted.");

  // Optional: Fetch vote result (if finalized)
  const status = await GenesisDAO.proposalStatus(proposalId);
  const yesVotes = await GenesisDAO.voteCount(proposalId, true);
  const noVotes = await GenesisDAO.voteCount(proposalId, false);

  console.log(`📊 Proposal Status: ${status === 1 ? 'Active' : status === 2 ? 'Passed' : 'Rejected'}`);
  console.log(`🟢 YES Votes: ${yesVotes.toString()} | 🔴 NO Votes: ${noVotes.toString()}`);
}

main().catch((error) => {
  console.error("🚨 Voting session failed:", error);
  process.exit(1);
});
