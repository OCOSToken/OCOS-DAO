import React, { useState } from "react";
import { ethers } from "ethers";
import { S47_DAO_VAULT_ABI, S47_DAO_VAULT_ADDRESS, OCOS_TOKEN_ABI, OCOS_TOKEN_ADDRESS } from "../utils/contracts";

export default function VotingPanel({ wallet, provider }) {
  const [taleWalletId, setTaleWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleVote = async () => {
    if (!taleWalletId || !amount) {
      setStatus("Please enter a valid Tale Wallet ID and amount.");
      return;
    }
    setLoading(true);
    setStatus("");

    try {
      const signer = provider.getSigner();
      const ocos = new ethers.Contract(OCOS_TOKEN_ADDRESS, OCOS_TOKEN_ABI, signer);
      const vault = new ethers.Contract(S47_DAO_VAULT_ADDRESS, S47_DAO_VAULT_ABI, signer);

      // 1. Approve OCOS tokens to the vault
      const decimals = 18; // OCOS Token decimals
      const value = ethers.utils.parseUnits(amount, decimals);
      const approveTx = await ocos.approve(S47_DAO_VAULT_ADDRESS, value);
      setStatus("Approving OCOS tokens...");
      await approveTx.wait();

      // 2. Call vote() on vault
      const voteTx = await vault.vote(Number(taleWalletId), value);
      setStatus("Submitting vote...");
      await voteTx.wait();

      setStatus("Vote submitted successfully!");
      setTaleWalletId("");
      setAmount("");
    } catch (error) {
      setStatus(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 my-6">
      <h2 className="text-2xl font-bold mb-4 text-sky-400">Vote for a Tale Wallet</h2>
      <label className="block mb-2 font-semibold">
        Tale Wallet ID (0 - 46999)
        <input
          className="w-full px-3 py-2 mt-1 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
          type="number"
          min="0"
          max="46999"
          placeholder="Enter Tale Wallet ID"
          value={taleWalletId}
          onChange={e => setTaleWalletId(e.target.value)}
          disabled={loading}
        />
      </label>
      <label className="block mb-2 font-semibold">
        Amount (OCOS)
        <input
          className="w-full px-3 py-2 mt-1 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
          type="number"
          min="0.0001"
          step="0.0001"
          placeholder="Enter OCOS amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={loading}
        />
      </label>
      <button
        onClick={handleVote}
        className={`w-full py-3 rounded-xl bg-sky-500 font-bold text-lg mt-2 transition-all ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:bg-sky-700"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Vote"}
      </button>
      {status && (
        <div className="mt-4 p-3 rounded-xl bg-gray-800 text-sm text-sky-200 border border-gray-700">
          {status}
        </div>
      )}
    </div>
  );
}
