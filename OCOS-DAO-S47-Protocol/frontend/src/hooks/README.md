# OCOS-DAO Frontend Hooks

This directory contains reusable, production-grade React hooks for all major OCOS-DAO frontend logic. Each hook is purpose-built for robust Web3 and DAO interactions, and is designed for integration with ethers.js and the project's smart contracts.

## Available Hooks

### 1. `useWallet.js`
Handles connecting and managing the user's crypto wallet (e.g., Metamask, WalletConnect). Exposes the active account address and wallet connection utilities.

### 2. `useOcosToken.js`
Provides an interface to the OCOS ERC20 token contract. Supports balance queries, transfers, and standard ERC20 operations.

### 3. `useS47DaoVault.js`
Connects to the S47 DAO Vault smart contract. Used for voting, retrieving voting power, and accessing Tale Wallet statistics and DAO state.

### 4. `useVoting.js`
Handles all DAO voting operations. Allows a user to cast votes on Tale Wallets and tracks voting transaction status.

### 5. `useTaleWallets.js`
Fetches and provides real-time statistics and data for all Tale Wallets in the DAO ecosystem. Useful for dashboards and leaderboard displays.

### 6. `useS47Stats.js`
Fetches and aggregates key DAO vault statistics including total S47 supply, Tale Wallet count, current voting round, OCOS balance in the vault, and per-wallet S47 distributions.

---

## Usage Example

```js
import { useWallet } from "../hooks/useWallet";
import { useS47Stats } from "../hooks/useS47Stats";

// Example usage in a component
const { account, connect } = useWallet();
const stats = useS47Stats(daoVaultContract, ocosTokenContract);
