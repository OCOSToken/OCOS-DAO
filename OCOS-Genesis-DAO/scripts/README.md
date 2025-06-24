# 🧠 OCOS DAO Scripts

This directory contains all interactive scripts related to the OCOS Genesis DAO smart contracts. These scripts allow secure and automated execution of DAO deployment, voting, snapshot, S47 verification, and vault procedures.

---

## 📂 Script Structure

| Folder       | Purpose                                                |
|--------------|--------------------------------------------------------|
| `deploy/`    | Scripts for deploying the DAO and sub-contracts       |
| `dao/`       | Proposal submission, voting, and result tracking      |
| `vault/`     | S47 proof system and encrypted vault integration      |
| `oracle/`    | Scripts for uploading oracle data to DAO              |
| `utils/`     | Utilities and analytics (checksum, audit, hash etc.)  |

---

## 📜 Core Scripts and Usage

### 1. `deploy_dao.js`
Deploys core contracts (Governance, Vault, DAO)
```bash
npx hardhat run scripts/deploy/deploy_dao.js --network yourNetwork
```

### 2. `verify_s47_proof.js`
Verifies DAO membership by submitting a BTC-style signature
- Requires `S47_SIGNATURE` and `VERIFIER_CONTRACT` in `.env`

### 3. `submit_proposal.js`
Submits a proposal to the DAO with a title and IPFS hash

### 4. `track_proposal_results.js`
Tracks proposal status and vote count (YES/NO)

### 5. `create_snapshot.js`
Triggers a token holder snapshot used for voting eligibility

---

## ⚙️ Environment Variables (`.env`)
Most scripts rely on the following environment variables:

```env
DAO_CONTRACT=0xDAOContractAddressHere
VERIFIER_CONTRACT=0xVerifierContractAddressHere
S47_SIGNATURE=0xBitcoinFormattedSignature
PROPOSAL_ID=1
```

---

## 📌 Notes
- All scripts use `ethers.js` and `hardhat`
- You can automate with `npm run` commands by defining them in `package.json`
- These scripts are fundamental for DAO infrastructure auditing, testing, and archival integrity

---

## 🛡️ Security Recommendations
- Do not store private keys or mnemonics directly in `.env`
- Update contract addresses in `.env` when redeploying
- Always test thoroughly on testnet before executing on mainnet

---

📁 **GitHub:** [OCOS DAO Repository](https://github.com/OCOSToken/OCOS-DAO)

🧩 For support or technical contribution: `core@ocos.io`
