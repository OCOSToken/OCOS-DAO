// frontend/src/hooks/useWallet.js

import { useState, useEffect, useCallback } from "react";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Connect to wallet (Metamask or any injected provider)
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setIsConnected(true);
        const network = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(network);
        setError(null);
      } catch (err) {
        setError("User rejected wallet connection or other error occurred.");
        setIsConnected(false);
      }
    } else {
      setError("No wallet provider found. Please install Metamask.");
      setIsConnected(false);
    }
  }, []);

  // Listen for account or chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setError(null);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    };

    const handleChainChanged = (_chainId) => {
      setChainId(_chainId);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum.removeListener) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // Disconnect wallet (clear state)
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setError(null);
  };

  return {
    account,
    chainId,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
  };
}
