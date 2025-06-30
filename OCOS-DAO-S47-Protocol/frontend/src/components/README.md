# OCOS-DAO Frontend Components

This directory contains all main and reusable React UI components for the OCOS-DAO platform. Each component is modular, highly maintainable, and aligned with modern Web3 and DAO UX best practices. Designed for seamless integration into all frontend views.

## Component Overview

- **DaoGovernance.js**  
  Handles DAO governance interface, proposal management, and on-chain voting UI.

- **DistributionHistory.js**  
  Displays historical data of S47 distributions, voting rounds, and previous DAO epochs.

- **InfoBanner.js**  
  Provides global notifications, important system messages, and alerts to all users.

- **Loader.js**  
  Professional loading indicator and asynchronous state animation for all async actions.

- **OcosBalance.js**  
  Shows the OCOS token balance for the connected user or the DAO vault in real time.

- **S47Stats.js**  
  Displays live S47 DAO stats: total S47, voting round, leaderboards, and more.

- **TaleWalletsList.js / TopTaleWallets.js**  
  Renders a list or leaderboard of the most active or highest-voted Tale Wallets in the DAO.

- **VotingPanel.js**  
  The main interface for voting actions, casting votes, and displaying voting results.

- **WalletConnect.js**  
  Secure wallet connection UI for Metamask, WalletConnect, or any EIP-1193 compatible wallet.

## Usage Example

```js
import DaoGovernance from "./DaoGovernance";
import WalletConnect from "./WalletConnect";

// In your main App component
<WalletConnect />
<DaoGovernance />
