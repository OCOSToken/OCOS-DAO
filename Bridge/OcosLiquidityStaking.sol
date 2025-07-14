// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simple ERC-20 interface (for OCOS, S47, etc.)
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract OcosLiquidityStaking {
    IERC20 public stakingToken;      // Token that users stake (e.g. OCOS, S47)
    IERC20 public rewardToken;       // Reward token (can be same as staking or different)
    address public owner;

    uint256 public rewardRate;       // Tokens rewarded per block
    uint256 public lastUpdateBlock;  // Last time rewards were updated
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;

    mapping(address => uint256) public userStake;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor(address _stakingToken, address _rewardToken, uint256 _rewardRate) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
        rewardRate = _rewardRate;
        lastUpdateBlock = block.number;
    }

    // Updates global and user reward data before any mutative action
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateBlock = block.number;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((block.number - lastUpdateBlock) * rewardRate * 1e18) / totalStaked);
    }

    function earned(address account) public view returns (uint256) {
        return
            ((userStake[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) +
            rewards[account];
    }

    // Stake tokens into pool
    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        totalStaked += amount;
        userStake[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    // Withdraw staked tokens
    function withdraw(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(userStake[msg.sender] >= amount, "Not enough staked");
        totalStaked -= amount;
        userStake[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
    }

    // Claim accumulated rewards
    function claimReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");
        rewards[msg.sender] = 0;
        rewardToken.transfer(msg.sender, reward);
    }

    // Only owner can update reward rate
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
    }

    // Emergency: owner can withdraw remaining reward tokens
    function rescueRewards(address to, uint256 amount) external onlyOwner {
        rewardToken.transfer(to, amount);
    }
}
