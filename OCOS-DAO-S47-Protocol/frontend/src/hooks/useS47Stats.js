// useS47Stats.js

import { useEffect, useState } from "react";
import { ethers } from "ethers";

/**
 * Custom React hook to fetch and update S47 DAO Vault statistics in real-time.
 * Fetches:
 *  - Total S47 supply (S47_TOTAL)
 *  - Number of Tale Wallets (TALE_WALLET_COUNT)
 *  - Current DAO voting round
 *  - Total OCOS tokens in the DAO Vault contract
 *  - Distributed S47 per wallet (for leaderboard or analytics)
 *
 * @param {Contract} daoVaultContract - ethers.js contract instance for S47DaoVault
 * @param {Contract} ocosTokenContract - ethers.js contract instance for OcosToken
 * @returns {object} S47 DAO Vault stats
 */
export function useS47Stats(daoVaultContract, ocosTokenContract) {
  const [stats, setStats] = useState({
    totalS47: null,
    taleWalletCount: null,
    votingRound: null,
    daoOcosBalance: null,
    s47PerWallet: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        setStats((prev) => ({ ...prev, loading: true }));

        // Fetch total S47 supply
        const totalS47 = await daoVaultContract.S47_TOTAL();

        // Fetch total Tale Wallets
        const taleWalletCount = await daoVaultContract.TALE_WALLET_COUNT();

        // Fetch current voting round
        const votingRound = await daoVaultContract.votingRound();

        // Fetch OCOS balance of the DAO vault contract itself (for treasury view)
        let daoOcosBalance = null;
        if (ocosTokenContract && daoVaultContract.address) {
          daoOcosBalance = await ocosTokenContract.balanceOf(daoVaultContract.address);
        }

        // Fetch distributed S47 per wallet (first 20 wallets as an example)
        let s47PerWallet = [];
        for (let i = 0; i < Math.min(20, taleWalletCount); i++) {
          const walletData = await daoVaultContract.taleWallets(i);
          s47PerWallet.push({
            walletId: i,
            voteCount: walletData.voteCount.toString(),
            s47Balance: walletData.s47Balance.toString(),
          });
        }

        setStats({
          totalS47: totalS47.toString(),
          taleWalletCount: taleWalletCount.toString(),
          votingRound: votingRound.toString(),
          daoOcosBalance: daoOcosBalance ? ethers.utils.formatEther(daoOcosBalance) : null,
          s47PerWallet,
          loading: false,
          error: null,
        });
      } catch (e) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: e.message || "Failed to fetch S47 DAO stats.",
        }));
      }
    }

    if (daoVaultContract) {
      fetchStats();
    }
  }, [daoVaultContract, ocosTokenContract]);

  return stats;
}
