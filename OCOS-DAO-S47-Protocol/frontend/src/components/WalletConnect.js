import React, { useState } from "react";

export default function WalletConnect({ onWalletConnected, onWalletDisconnected }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setConnecting(true);
    setError("");
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        if (onWalletConnected) onWalletConnected(accounts[0]);
      } else {
        setError("MetaMask is not installed. Please install MetaMask to continue.");
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    }
    setConnecting(false);
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    if (onWalletDisconnected) onWalletDisconnected();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {walletAddress ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-700 rounded-xl font-mono text-sm select-all shadow">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-gray-700 transition"
            >
              Disconnect
            </button>
          </div>
          <span className="text-xs text-gray-400">Wallet connected</span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-2xl shadow-xl text-white font-bold transition-all text-lg"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}
