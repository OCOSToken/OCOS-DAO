// src/hooks/useS47DaoVault.js

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import S47DaoVaultABI from "../abi/S47DaoVault.json";

/**
 * useS47DaoVault
 * React hook to interact with the S47DaoVault smart contract.
 *
 * @param {object} signer - Ethers.js signer (from useWallet or provider)
 * @returns {object} Methods and state for S47DaoVault contract interactions
 */
const S47_DAO_VAULT_ADDRESS = "0xYourS47DaoVaultContractAddress"; // Replace with actual deployed address

export function useS47DaoVault(signer) {
  const [contract, setContract] = useState(null);
  const [votingRound, setVotingRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize contract
  useEffect(() => {
    if (signer) {
      const s47Contract = new ethers.Contract(
        S47_DAO_VAULT_ADDRESS,
        S47DaoVaultABI,
        signer
      );
      setContract(s47Contract);
    } else {
      setContract(null);
    }
  }, [signer]);

  // Get current voting round
  const fetchVotingRound = useCallback(async () => {
    if (!contract) return;
    try {
      const round = await contract.votingRound();
      setVotingRound(round.toNumber());
    } catch (err) {
      setError("Failed to fetch voting round.");
    }
  }, [contract]);

  // Vote function
  const vote = useCallback(
    async (walletId, amount) => {
      if (!contract) return false;
      setLoading(true);
      setError(null);
      try {
        const tx = await contract.vote(walletId, amount);
        await tx.wait();
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError(err.message || "Voting failed.");
        return false;
      }
    },
    [contract]
  );

  // Get TaleWallet data (single or batch)
  const getTaleWallet = useCallback(
    async (walletId) => {
      if (!contract) return null;
      try {
        const data = await contract.taleWallets(walletId);
        return {
          voteCount: data.voteCount.toString(),
          s47Balance: data.s47Balance.toString(),
        };
      } catch {
        return null;
      }
    },
    [contract]
  );

  // Example: get first N TaleWallets
  const getTaleWallets = useCallback(
    async (count = 100) => {
      if (!contract) return [];
      const wallets = [];
      for (let i = 0; i < count; i++) {
        const data = await getTaleWallet(i);
        wallets.push({ id: i, ...data });
      }
      return wallets;
    },
    [contract, getTaleWallet]
  );

  // Distribute S47 (owner only)
  const nextRound = useCallback(async () => {
    if (!contract) return false;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.nextRound();
      await tx.wait();
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Next round failed.");
      return false;
    }
  }, [contract]);

  // Fetch current round on contract or signer change
  useEffect(() => {
    fetchVotingRound();
  }, [fetchVotingRound, contract]);

  return {
    contract,
    votingRound,
    loading,
    error,
    vote,
    getTaleWallet,
    getTaleWallets,
    nextRound,
    fetchVotingRound,
  };
}
