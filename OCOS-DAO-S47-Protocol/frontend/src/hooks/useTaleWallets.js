// src/hooks/useTaleWallets.js

import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

/**
 * Custom React hook to fetch and manage Tale Wallets data from the DAO Vault contract.
 * Fetches the top N Tale Wallets and provides loading and error states.
 *
 * @param {Object} daoVaultContract - Ethers.js contract instance for the DAO Vault.
 * @param {number} count - Number of Tale Wallets to fetch (default: 100).
 * @returns {Object} { wallets, loading, error, reload }
 */
export function useTaleWallets(daoVaultContract, count = 100) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallets = async () => {
    if (!daoVaultContract) return;
    setLoading(true);
    setError(null);
    try {
      const walletList = [];
      // Efficiently fetch the top N Tale Wallets
      for (let i = 0; i < count; i++) {
        const data = await daoVaultContract.taleWallets(i);
        walletList.push({
          id: i,
          voteCount: BigNumber.from(data.voteCount).toString(),
          s47Balance: BigNumber.from(data.s47Balance).toString(),
        });
      }
      setWallets(walletList);
    } catch (err) {
      setError("Failed to load Tale Wallets.");
      setWallets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWallets();
    // eslint-disable-next-line
  }, [daoVaultContract, count]);

  // Manual reload function
  const reload = () => {
    fetchWallets();
  };

  return { wallets, loading, error, reload };
}
