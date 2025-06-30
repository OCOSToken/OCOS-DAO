// useVoting.js

import { useState, useCallback } from "react";

/**
 * useVoting - Hook for managing voting actions in the OCOS DAO
 * @param {Contract} daoVaultContract - ethers.js contract instance for S47 DAO Vault
 * @param {Function} onVoteSuccess - optional callback after a successful vote
 * @param {Function} onVoteError - optional callback after a failed vote
 * @returns {
 *   vote: Function,
 *   isVoting: Boolean,
 *   voteError: String | null,
 *   lastTxHash: String | null
 * }
 */
export function useVoting(daoVaultContract, onVoteSuccess, onVoteError) {
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [lastTxHash, setLastTxHash] = useState(null);

  // vote for a specific tale wallet with a given amount of OCOS
  const vote = useCallback(
    async (walletId, amount) => {
      setIsVoting(true);
      setVoteError(null);
      setLastTxHash(null);

      if (!daoVaultContract) {
        setVoteError("DAO contract not connected.");
        setIsVoting(false);
        return;
      }

      try {
        // amount should be already in correct units (e.g. ethers.utils.parseUnits(amount, 18))
        const tx = await daoVaultContract.vote(walletId, amount);
        setLastTxHash(tx.hash);
        await tx.wait();
        setIsVoting(false);
        if (typeof onVoteSuccess === "function") onVoteSuccess(tx);
        return true;
      } catch (error) {
        setVoteError(error.reason || error.message || "Unknown voting error.");
        setIsVoting(false);
        if (typeof onVoteError === "function") onVoteError(error);
        return false;
      }
    },
    [daoVaultContract, onVoteSuccess, onVoteError]
  );

  return {
    vote,
    isVoting,
    voteError,
    lastTxHash,
  };
}

export default useVoting;
