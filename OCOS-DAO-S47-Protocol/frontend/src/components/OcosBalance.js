// frontend/src/components/OcosBalance.js

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// OCOS token contract address and ABI (ERC20 standard)
const OCOS_TOKEN_ADDRESS = "0xYourOcosTokenAddress"; // <- replace with actual
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export default function OcosBalance({ wallet }) {
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(18);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch OCOS balance when wallet changes
  useEffect(() => {
    if (!wallet) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError("");
      try {
        // Create provider (MetaMask injected)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(OCOS_TOKEN_ADDRESS, ERC20_ABI, provider);

        const [rawBalance, tokenDecimals] = await Promise.all([
          contract.balanceOf(wallet),
          contract.decimals(),
        ]);
        setDecimals(tokenDecimals);
        // Format balance according to decimals
        setBalance(Number(ethers.utils.formatUnits(rawBalance, tokenDecimals)));
      } catch (err) {
        setError("Unable to fetch OCOS balance.");
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [wallet]);

  if (!wallet)
    return (
      <div className="p-4 bg-gray-900 rounded-xl text-center text-gray-300 shadow">
        Please connect your wallet to view OCOS balance.
      </div>
    );

  if (loading)
    return (
      <div className="p-4 bg-gray-900 rounded-xl text-center text-sky-400 shadow animate-pulse">
        Loading OCOS balance...
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-gray-900 rounded-xl text-center text-red-400 shadow">
        {error}
      </div>
    );

  return (
    <div className="p-4 bg-gray-800 rounded-2xl flex flex-col items-center shadow-lg">
      <div className="text-gray-400 text-xs mb-1">Wallet</div>
      <div className="font-mono font-bold text-lg mb-2 truncate">{wallet}</div>
      <div className="text-gray-400 text-xs mb-1">OCOS Balance</div>
      <div className="text-3xl font-extrabold text-sky-400">
        {balance !== null ? balance.toLocaleString("en-US", { maximumFractionDigits: 4 }) : "--"}
      </div>
    </div>
  );
}
