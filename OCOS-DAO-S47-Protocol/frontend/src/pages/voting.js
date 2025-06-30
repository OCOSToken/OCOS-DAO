import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Smart contract ABIs and addresses (add correct values)
import OCOS_ABI from "../abis/OcosToken.json";
import DAO_ABI from "../abis/S47DaoVault.json";
const OCOS_ADDRESS = "0xOcosTokenAddress";
const DAO_ADDRESS = "0xDaoContractAddress";

export default function VotingPage() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const [taleWalletId, setTaleWalletId] = useState("");
  const [voteAmount, setVoteAmount] = useState("");
  const [status, setStatus] = useState("");
  const [votingResult, setVotingResult] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Connect to wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setWallet(account);
      setConnected(true);
      await fetchBalance(account, provider);
      await fetchVotingResult(provider);
    } else {
      setStatus("Please install Metamask!");
    }
  }

  // Fetch OCOS token balance
  async function fetchBalance(account, provider) {
    const ocos = new ethers.Contract(OCOS_ADDRESS, OCOS_ABI, provider);
    const rawBalance = await ocos.balanceOf(account);
    setBalance(ethers.utils.formatEther(rawBalance));
  }

  // Fetch voting results (top 5 Tale Wallets)
  async function fetchVotingResult(provider) {
    const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);
    let results = [];
    // Example: Loop for top 5 wallets (customize as needed)
    for (let i = 0; i < 5; i++) {
      const walletData = await dao.taleWallets(i);
      results.push({
        id: i,
        voteCount: ethers.utils.formatUnits(walletData.voteCount, 0),
        s47Balance: walletData.s47Balance.toString(),
      });
    }
    setVotingResult(results);
  }

  // Vote function
  async function handleVote() {
    if (!taleWalletId || !voteAmount) {
      setStatus("Select Tale Wallet and enter OCOS amount.");
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Approve OCOS to DAO contract
      const ocos = new ethers.Contract(OCOS_ADDRESS, OCOS_ABI, signer);
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);

      const amountWei = ethers.utils.parseEther(voteAmount);
      const tx1 = await ocos.approve(DAO_ADDRESS, amountWei);
      await tx1.wait();
      // Vote
      const tx2 = await dao.vote(parseInt(taleWalletId), amountWei);
      await tx2.wait();
      setStatus("Vote submitted successfully!");
      await fetchVotingResult(provider);
      await fetchBalance(wallet, provider);
    } catch (e) {
      setStatus("Transaction failed: " + (e.data?.message || e.message));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (connected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      fetchBalance(wallet, provider);
      fetchVotingResult(provider);
    }
    // eslint-disable-next-line
  }, [connected, wallet]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-sky-400">OCOS DAO Voting Panel</h2>
        {!connected ? (
          <button
            onClick={connectWallet}
            className="bg-sky-500 px-6 py-3 rounded-xl text-white font-semibold hover:bg-sky-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <div className="mb-4">
              <span className="font-semibold">Connected:</span> {wallet.slice(0, 8)}…{wallet.slice(-6)}
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <span className="text-sky-300 font-bold">Your OCOS balance: {balance}</span>
              <label className="text-sm font-semibold">Tale Wallet ID (0-46999):</label>
              <input
                type="number"
                min="0"
                max="46999"
                value={taleWalletId}
                onChange={(e) => setTaleWalletId(e.target.value)}
                className="bg-gray-800 rounded p-2 mb-2 w-full"
                placeholder="e.g. 23"
              />
              <label className="text-sm font-semibold">OCOS to Vote With:</label>
              <input
                type="number"
                min="1"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="bg-gray-800 rounded p-2 mb-2 w-full"
                placeholder="e.g. 100"
              />
              <button
                onClick={handleVote}
                disabled={loading}
                className="bg-sky-600 px-6 py-2 rounded-xl text-white font-bold mt-2 hover:bg-sky-700 transition"
              >
                {loading ? "Voting…" : "Vote Now"}
              </button>
              <div className="text-yellow-300 text-xs mt-2">{status}</div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg text-sky-400 mb-2">Top 5 Tale Wallets</h3>
              <table className="w-full bg-gray-800 rounded-xl text-center">
                <thead>
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Vote Count</th>
                    <th className="p-2">S47 Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {votingResult.map((w) => (
                    <tr key={w.id} className="border-b border-gray-700">
                      <td className="p-2">{w.id}</td>
                      <td className="p-2">{w.voteCount}</td>
                      <td className="p-2">{w.s47Balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
