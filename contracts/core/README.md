# 🧾 ProposalStakingGuard.sol

## 📌 Overview
The `ProposalStakingGuard` contract provides an anti-spam staking layer for DAO proposal submission. Before a user can submit a proposal to the DAO, they must lock a minimum number of governance tokens. Once the proposal is finalized or resolved by the DAO, the staked amount is released.

---

## ⚙️ Key Features
- Prevents spam/flooding of DAO proposals
- Requires token staking before submission
- Stake is released only after DAO confirms completion
- `onlyDAO`-protected control for secure fund release

---

## 🔐 Constructor Parameters
```solidity
constructor(address _token, address _dao, uint256 _minStake)
```
- `_token` — Address of the DAO’s governance token contract
- `_dao` — Address of the DAO controller contract
- `_minStake` — Required amount to stake for proposal eligibility

---

## 🚀 Core Functions
### `stakeForProposal()`
Locks tokens from sender for staking eligibility.

### `releaseStake(address proposer)`
Callable only by DAO to unlock staked tokens for a proposer.

### `setMinimumStake(uint256 newMin)`
Updates the required minimum stake amount (onlyDAO).

### `isStaked(address)`
Returns whether an address has an active proposal stake.

---

## 🧪 Test Case Example (Hardhat + Ethers.js)
```js
const { expect } = require("chai");
describe("ProposalStakingGuard", function () {
  let token, dao, staking, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockGovernanceToken");
    token = await Token.deploy("OCOS", "OCOS", 18);
    await token.mint(user.address, 1000);

    const Staking = await ethers.getContractFactory("ProposalStakingGuard");
    staking = await Staking.deploy(token.address, owner.address, 100);
    await token.connect(user).approve(staking.address, 100);
  });

  it("should stake successfully", async function () {
    await staking.connect(user).stakeForProposal();
    expect(await staking.isStaked(user.address)).to.be.true;
  });

  it("should release stake by DAO", async function () {
    await staking.connect(user).stakeForProposal();
    await staking.connect(owner).releaseStake(user.address);
    expect(await staking.isStaked(user.address)).to.be.false;
  });
});
```

---

## 🛡️ Security Considerations
- DAO must verify proposal completion before releasing funds
- Stake is locked in contract and cannot be reclaimed prematurely
- Only DAO can trigger release (via `onlyDAO` modifier)

---

## 🧠 DAO Governance Benefit
This contract enforces economic weight behind every DAO proposal. By requiring skin in the game, it filters unserious actors and creates stronger governance signal.

---

📂 **Module Location:** `contracts/proposal/ProposalStakingGuard.sol`

📩 Contact: `core@ocos.io`
