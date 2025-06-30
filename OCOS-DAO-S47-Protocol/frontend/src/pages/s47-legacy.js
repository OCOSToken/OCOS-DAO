import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Smart contract ABI and address (add correct values)
import DAO_ABI from "../abis/S47DaoVault.json";
const DAO_ADDRESS = "0xDaoContractAddress";

// Constants for display (static protocol stats)
const S47_TOTAL = 1_100_000;
const TALE_WALLET_COUNT = 47000;

export default function S47LegacyPage() {
  const [totalDistributed, setTotalDistributed] = useState("0");
  const [topWallets, setTopWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch global stats from contract (e.g., total S47 distributed, top Tale Wallets)
  async function fetchLegacyStats() {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);
      // Aggregate stats: Sum up S47 balances in Tale Wallets (show top 5 for demo)
      let distributed = ethers.BigNumber.from(0);
      let wallets = [];
      for (let i = 0; i < 5; i++) {
        const walletData = await dao.taleWallets(i);
        distributed = distributed.add(walletData.s47Balance);
        wallets.push({
          id: i,
          s47Balance: walletData.s47Balance.toString(),
          voteCount: ethers.utils.formatUnits(walletData.voteCount, 0),
        });
      }
      setTotalDistributed(distributed.toString());
      setTopWallets(wallets);
    } catch (e) {
      setTotalDistributed("0");
      setTopWallets([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLegacyStats();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-yellow-400">S47 Legacy</h2>
        <p className="mb-6 text-lg text-gray-200">
          <span className="font-bold text-yellow-300">S47 Legacy</span> is the decentralized, community-owned digital inheritance entrusted by S470SHI to the OCOS-DAO. <br />
          <br />
          <span className="italic text-gray-400">"The fate of 1.1 million S47 units now belongs to the people. Every OCOS token holder helps decide the distribution and destiny of the world's most transparent digital legacy."</span>
        </p>
        <div className="mb-6 grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-gray-300 text-xs">Total S47 Supply</div>
            <div className="text-2xl font-bold text-yellow-300">{S47_TOTAL.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-gray-300 text-xs">Number of Tale Wallets</div>
            <div className="text-2xl font-bold text-sky-300">{TALE_WALLET_COUNT.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow col-span-2">
            <div className="text-gray-300 text-xs">S47 Distributed (Top 5 wallets)</div>
            <div className="text-xl font-bold text-green-400">{Number(totalDistributed).toLocaleString()}</div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Top 5 Tale Wallets by S47 Received</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full bg-gray-800 rounded-xl text-center">
              <thead>
                <tr>
                  <th className="p-2">Wallet ID</th>
                  <th className="p-2">S47 Balance</th>
                  <th className="p-2">Vote Count</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-yellow-300 text-xl animate-pulse">
                      Loading...
                    </td>
                  </tr>
                ) : topWallets.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-gray-400">
                      No Tale Wallets found.
                    </td>
                  </tr>
                ) : (
                  topWallets.map((w) => (
                    <tr key={w.id} className="border-b border-gray-700">
                      <td className="p-2">{w.id}</td>
                      <td className="p-2">{w.s47Balance}</td>
                      <td className="p-2">{w.voteCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          All S47 allocations and voting are 100% on-chain and auditable by anyone. <br />
          <span className="text-yellow-300 font-semibold">OCOS-DAO S47 Protocol</span> is fully open-source and transparent.
        </div>
      </div>
    </div>
  );
}
