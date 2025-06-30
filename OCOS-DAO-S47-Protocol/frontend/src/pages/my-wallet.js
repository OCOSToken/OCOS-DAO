import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Smart contract ABIs and addresses (replace with actual values)
import OCOS_ABI from "../abis/OcosToken.json";
import DAO_ABI from "../abis/S47DaoVault.json";
const OCOS_ADDRESS = "0xa249bA073C01Ceb65Eafae7625d8f503C1f61C84";
const DAO_ADDRESS = "0xDaoContractAddress";

export default function MyWalletPage() {
  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);
  const [ocosBalance, setOcosBalance] = useState("0");
  const [myVotes, setMyVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setWallet(account);
      setConnected(true);
      await fetchWalletData(account, provider);
    }
  }

  // Fetch OCOS balance and voting history from contracts
  async function fetchWalletData(account, provider) {
    setLoading(true);
    try {
      // Get OCOS token balance
      const ocos = new ethers.Contract(OCOS_ADDRESS, OCOS_ABI, provider);
      const rawBalance = await ocos.balanceOf(account);
      setOcosBalance(ethers.utils.formatEther(rawBalance));

      // Fetch voting history from DAO contract (using events)
      const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);
      let votesList = [];
      if (dao.queryFilter && dao.filters && dao.filters.Voted) {
        const events = await dao.queryFilter(
          dao.filters.Voted(account, null, null),
          -5000 // last 5000 blocks (customize for your chain)
        );
        votesList = events.map(ev => ({
          taleWalletId: ev.args.walletId.toString(),
          amount: ethers.utils.formatEther(ev.args.amount),
          block: ev.blockNumber,
        }));
      }
      setMyVotes(votesList.reverse()); // most recent first
    } catch (e) {
      setOcosBalance("0");
      setMyVotes([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (connected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      fetchWalletData(wallet, provider);
    }
    // eslint-disable-next-line
  }, [connected, wallet]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-16">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-4 text-sky-400">My Wallet</h2>
        {!connected ? (
          <button
            onClick={connectWallet}
            className="bg-sky-500 px-6 py-3 rounded-xl text-white font-semibold hover:bg-sky-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="mb-6">
              <div className="font-semibold text-sky-200 mb-2">
                Address: <span className="text-white">{wallet.slice(0, 8)}…{wallet.slice(-6)}</span>
              </div>
              <div>
                <span className="font-semibold">OCOS Balance:</span>{" "}
                <span className="text-sky-300">{ocosBalance}</span>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg text-sky-400 mb-2">Your Voting History</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full bg-gray-800 rounded-xl text-center">
                  <thead>
                    <tr>
                      <th className="p-2">Tale Wallet ID</th>
                      <th className="p-2">OCOS Voted</th>
                      <th className="p-2">Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-sky-300 text-xl animate-pulse">
                          Loading...
                        </td>
                      </tr>
                    ) : myVotes.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-gray-400">
                          No voting history found.
                        </td>
                      </tr>
                    ) : (
                      myVotes.map((v, i) => (
                        <tr key={i} className="border-b border-gray-700">
                          <td className="p-2">{v.taleWalletId}</td>
                          <td className="p-2">{v.amount}</td>
                          <td className="p-2">{v.block}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                * Showing last {myVotes.length} votes (most recent first)
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
