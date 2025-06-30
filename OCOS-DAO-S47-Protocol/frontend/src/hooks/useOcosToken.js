import { useEffect, useState } from "react";
import { ethers } from "ethers";
import OcosTokenABI from "../abi/OcosToken.json";

/**
 * useOcosToken hook
 * Returns an ethers.js contract instance for the OCOS Token.
 * Automatically updates if signer or network changes.
 *
 * @param {ethers.Signer | ethers.providers.Provider} providerOrSigner - Web3 provider or signer.
 * @param {string} tokenAddress - OCOS Token contract address.
 * @returns {ethers.Contract|null} OCOS Token contract instance or null if not ready.
 */
export function useOcosToken(providerOrSigner, tokenAddress) {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (providerOrSigner && tokenAddress) {
      try {
        const ocosToken = new ethers.Contract(tokenAddress, OcosTokenABI, providerOrSigner);
        setContract(ocosToken);
      } catch (err) {
        setContract(null);
        console.error("Failed to initialize OCOS Token contract:", err);
      }
    } else {
      setContract(null);
    }
  }, [providerOrSigner, tokenAddress]);

  return contract;
}
