import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Smart contract ABI and address (add correct values)
import DAO_ABI from "../abis/S47DaoVault.json";
const DAO_ADDRESS = "0xYourDaoContractAddress";

export default function TaleWalletsPage() {
  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [minVotes, setMinVotes] = useState("");
  const [showCount, setShowCount] = useState(20); // Default: 20 items

  // Connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setWallet(account);
      setConnected(true);
      await fetchWallets(provider, showCount);
    }
  }

  // Fetch Tale Wallets from contract
  async function fetchWallets(provider, count = 20) {
    setLoading(true);
    try {
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);
      let items = [];
      for (let i = 0; i < count; i++) {
        const data = await dao.taleWallets(i);
        items.push({
          id: i,
          voteCount: ethers.utils.formatUnits(data.voteCount, 0),
          s47Balance: data.s47Balance.toString(),
        });
      }
      setWallets(items);
    } catch (e) {
      setWallets([]);
    }
    setLoading(false);
  }

  // Handle filters/search
  function filteredWallets() {
    return wallets
      .filter(w =>
        (searchId === "" || w.id === Number(searchId)) &&
        (minVotes === "" || Number(w.voteCount) >= Number(minVotes))
      );
  }

  // On mount/load, connect if already available
  useEffect(() => {
    if (connected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      fetchWallets(provider, showCount);
    }
    // eslint-disable-next-line
  }, [connected, showCount]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-sky-400">Tale Wallets</h2>
        {!connected ? (
          <button
            onClick={connectWallet}
            className="bg-sky-500 px-6 py-3 rounded-xl text-white font-semibold hover:bg-sky-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="number"
                min="0"
                max="46999"
                placeholder="Search by Wallet ID"
                className="bg-gray-800 text-white rounded p-2 flex-1"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder="Min. Votes"
                className="bg-gray-800 text-white rounded p-2 flex-1"
                value={minVotes}
                onChange={(e) => setMinVotes(e.target.value)}
              />
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="bg-gray-800 text-white rounded p-2 flex-1"
              >
                {[10, 20, 50, 100].map(n => (
                  <option key={n} value={n}>
                    Show {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full bg-gray-800 rounded-xl text-center">
                <thead>
                  <tr>
                    <th className="p-2">Wallet ID</th>
                    <th className="p-2">Vote Count</th>
                    <th className="p-2">S47 Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-sky-300 text-xl animate-pulse">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredWallets().length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-gray-400">
                        No wallets found.
                      </td>
                    </tr>
                  ) : (
                    filteredWallets().map(w => (
                      <tr key={w.id} className="border-b border-gray-700">
                        <td className="p-2">{w.id}</td>
                        <td className="p-2">{w.voteCount}</td>
                        <td className="p-2">{w.s47Balance}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Showing first {showCount} Tale Wallets.  
              <br />
              For performance, load more using the selector above.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
