# 🏛 OCOS DAO

**OCOS DAO** is the official decentralized governance protocol of the **OCOS Token** ecosystem. It enables token holders to participate in the decision-making process through secure, transparent, and automated smart contracts built on blockchain.

This repository contains the full smart contract source code, configuration files, and deployment scripts for the OCOS DAO system.

---

## 📌 Overview

> The OCOS DAO system empowers the OCOS community to propose, vote, and execute key protocol decisions without central authority. All actions are governed by smart contracts and the will of token holders.

---

## 🧱 Architecture & Modules

The DAO system is composed of the following on-chain modules:

| Component            | Contract / Description                                                                 |
|----------------------|------------------------------------------------------------------------------------------|
| **Governor**         | `OCOSGovernor.sol` — manages proposals, voting, and execution via governance token      |
| **TimeLock**         | `OCOSTimelock.sol` — enforces delay between voting approval and on-chain execution       |
| **Governance Token** | `OCOSToken.sol` — ERC20Votes-enabled token required for participation (already deployed)|
| **Treasury (Optional)** | `OCOSTreasury.sol` — optional contract for community fund control                     |

---

## ⚙️ Governance Parameters

| Parameter              | Value                    | Description |
|------------------------|--------------------------|-------------|
| **Voting Delay**       | `1 block`                | Delay before voting starts after a proposal is submitted |
| **Voting Period**      | `6570 blocks (~1 day)`   | Duration of voting window |
| **Proposal Threshold** | `100,000 OCOS`           | Minimum tokens required to create a proposal |
| **Quorum**             | `4%` of total supply     | Minimum participation for a vote to be valid |
| **Timelock Delay**     | `86400 seconds (1 day)`  | Delay before an accepted proposal is executed |

---

## 📦 Installation

To set up this project locally:

```bash
git clone https://github.com/OCOSToken/OCOS-DAO.git
cd OCOS-DAO
npm install
npx hardhat compile
