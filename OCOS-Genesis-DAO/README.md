# 🧬 OCOS Genesis DAO

**OCOS Genesis DAO** is a decentralized governance framework inspired by the early architecture of Bitcoin (S47) and designed to establish an immutable and cryptographically verifiable consensus layer for community-led decisions.

This repository hosts the complete DAO infrastructure — from smart contracts and proposal systems to verifiable vaults and audit scripts — engineered for transparency, autonomy, and long-term trust.

---

## 🌐 Project Structure

| Directory | Description |
|-----------|-------------|
| `contracts/` | Solidity smart contracts for DAO logic, governance token, vaults, verifiers |
| `scripts/` | Hardhat-compatible scripts for deployment, proposal management, voting, and proof submission |
| `docs/` | Technical documentation, audit reports, whitepapers, and governance logic |
| `data/` | DAO-related data, including historical S47 vaults, snapshots, and hashed proofs |
| `vaults/` | Encrypted legacy BTC (S47) file representations (AES secured, indexable) |

---

## ⚙️ Core Components

### 🔐 Smart Contracts
- **OCOSGenesisDAO.sol** – The core decentralized governance mechanism
- **OCOSGovernanceToken.sol** – ERC20/BEP20 compatible voting token
- **VaultS47.sol** – Immutable symbolic vault contract for S47 (legacy BTC) reserves
- **S47ProofVerifier.sol** – Verifies signed messages from legacy Bitcoin addresses for DAO eligibility

### 🗳️ Governance Tools
- Proposal submission and tracking
- Snapshot-based voting
- DAO-level event logging and audit trail support

### 🔁 Data Layer
- `wallet_00001.dat.aes → wallet_47000.dat.aes`: Simulated, indexable, and AES-encrypted symbolic vaults
- Checksum integrity via `SHA256`
- Proposal metadata, vote history, oracle feeds

---

## 📖 Documentation Highlights
- `docs/whitepaper.md` – Foundational principles and governance mechanisms
- `docs/history/2009/` – Technical reconstructions of early blockchain behavior
- `docs/theory/` – Cryptoeconomic logic and symbolic decentralization framework

---

## 🚀 Deployment & Usage
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` with contract addresses and secrets
4. Run DAO operations via scripts:
   ```bash
   npx hardhat run scripts/dao/submit_proposal.js --network yourNetwork
   ```

---

## 🛡️ Security & Audit
- All on-chain proofs are one-way hash verified
- DAO contract deployment and genesis hash is timestamped and community observable
- All `.dat.aes` vault files have matching SHA256 checksums in `/vaults/checksum`

---

## 📬 Contributing
Pull requests and audit findings are welcome.
For core proposals and DAO participation, reach out to `core@ocos.io`.

---

**Genesis is not a beginning. It is a decision to decentralize trust.**

> 🧱 Powered by the OCOS Community · Verified by Proof · Governed by Code
