import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Smart contract ABI and address (add correct values)
import DAO_ABI from "../abis/S47DaoVault.json";
const DAO_ADDRESS = "0xDaoContractAddress";

// Example: Governance rules (static, for info block)
const GOVERNANCE_RULES = [
  "Every OCOS token holder can submit proposals.",
  "Proposals are approved or rejected by community voting.",
  "Voting power is proportional to the amount of OCOS staked.",
  "All votes and decisions are recorded on-chain and cannot be changed.",
  "Only the community decides the distribution and destiny of S47.",
];

export default function GovernancePage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProposal, setNewProposal] = useState("");
  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");

  // Connect to wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setWallet(account);
      setConnected(true);
    }
  }

  // Fetch proposals from contract (if ProposalCreated events are available)
  async function fetchProposals() {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);

      // Check if ProposalCreated event exists in contract ABI
      let proposalList = [];
      if (dao.queryFilter && dao.filters && dao.filters.ProposalCreated) {
        const events = await dao.queryFilter(
          dao.filters.ProposalCreated(),
          -5000 // Last 5000 blocks
        );
        proposalList = events
          .map(ev => ({
            id: ev.args.proposalId.toString(),
            title: ev.args.title,
            proposer: ev.args.proposer,
            created: ev.blockNumber,
            votesFor: ev.args.votesFor?.toString() ?? "0",
            votesAgainst: ev.args.votesAgainst?.toString() ?? "0",
            status: ev.args.status ?? "Active",
          }))
          .reverse();
      }
      setProposals(proposalList);
    } catch (e) {
      setProposals([]);
    }
    setLoading(false);
  }

  // Submit a new proposal (if contract allows it)
  async function submitProposal() {
    if (!newProposal.trim()) {
      setStatus("Enter your proposal text.");
      return;
    }
    setStatus("Submitting...");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
      // Contract must have a `submitProposal(string)` or similar method
      const tx = await dao.submitProposal(newProposal.trim());
      await tx.wait();
      setStatus("Proposal submitted!");
      setNewProposal("");
      fetchProposals();
    } catch (e) {
      setStatus("Submission failed: " + (e.data?.message || e.message));
    }
  }

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-emerald-400">Governance</h2>
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-emerald-300 mb-2">DAO Governance Rules</h3>
          <ul className="list-disc pl-6 text-gray-200">
            {GOVERNANCE_RULES.map((rule, i) => (
              <li key={i} className="mb-1">{rule}</li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <h3 className="font-semibold text-lg text-emerald-300 mb-2">Active Proposals</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full bg-gray-800 rounded-xl text-center">
              <thead>
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Proposer</th>
                  <th className="p-2">Block</th>
                  <th className="p-2">Votes For</th>
                  <th className="p-2">Votes Against</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-emerald-300 text-xl animate-pulse">
                      Loading...
                    </td>
                  </tr>
                ) : proposals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-gray-400">
                      No proposals found.
                    </td>
                  </tr>
                ) : (
                  proposals.map((p) => (
                    <tr key={p.id} className="border-b border-gray-700">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.title}</td>
                      <td className="p-2">{p.proposer.slice(0, 8)}…{p.proposer.slice(-6)}</td>
                      <td className="p-2">{p.created}</td>
                      <td className="p-2">{p.votesFor}</td>
                      <td className="p-2">{p.votesAgainst}</td>
                      <td className="p-2">{p.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-emerald-300 mb-2">Submit a Proposal</h3>
          {!connected ? (
            <button
              onClick={connectWallet}
              className="bg-emerald-500 px-6 py-3 rounded-xl text-white font-semibold hover:bg-emerald-700 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter your proposal here…"
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
                className="bg-gray-800 text-white rounded p-2"
                maxLength={120}
              />
              <button
                onClick={submitProposal}
                className="bg-emerald-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-emerald-700 transition"
              >
                Submit Proposal
              </button>
              <div className="text-yellow-300 text-xs">{status}</div>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400">
          All governance proposals and votes are 100% on-chain and cannot be altered. <br />
          The OCOS-DAO community controls the future of the protocol.
        </div>
      </div>
    </div>
  );
}
