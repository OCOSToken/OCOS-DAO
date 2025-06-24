// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ProposalStakingGuard
/// @notice Prevents spam by requiring proposers to stake tokens before submitting DAO proposals

interface IGovernanceToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract ProposalStakingGuard {
    IGovernanceToken public immutable token;
    address public daoAddress;
    uint256 public minimumStake;

    mapping(address => uint256) public stakedAmount;
    mapping(address => bool) public hasActiveProposal;

    event Staked(address indexed proposer, uint256 amount);
    event Unstaked(address indexed proposer, uint256 amount);
    event MinimumStakeChanged(uint256 newAmount);

    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Not authorized");
        _;
    }

    constructor(address _token, address _dao, uint256 _minStake) {
        token = IGovernanceToken(_token);
        daoAddress = _dao;
        minimumStake = _minStake;
    }

    /// @notice Proposer stakes tokens before submitting proposal
    function stakeForProposal() external {
        require(!hasActiveProposal[msg.sender], "Already staked for active proposal");
        require(token.balanceOf(msg.sender) >= minimumStake, "Insufficient balance to stake");

        bool success = token.transferFrom(msg.sender, address(this), minimumStake);
        require(success, "Stake transfer failed");

        stakedAmount[msg.sender] = minimumStake;
        hasActiveProposal[msg.sender] = true;

        emit Staked(msg.sender, minimumStake);
    }

    /// @notice DAO calls this after proposal is resolved to unlock staked funds
    function releaseStake(address proposer) external onlyDAO {
        require(hasActiveProposal[proposer], "No active stake");

        uint256 amount = stakedAmount[proposer];
        stakedAmount[proposer] = 0;
        hasActiveProposal[proposer] = false;

        bool success = token.transfer(proposer, amount);
        require(success, "Unstake failed");

        emit Unstaked(proposer, amount);
    }

    /// @notice DAO can adjust minimum stake
    function setMinimumStake(uint256 _newMin) external onlyDAO {
        minimumStake = _newMin;
        emit MinimumStakeChanged(_newMin);
    }

    /// @notice View function to check if proposer has staked
    function isStaked(address proposer) external view returns (bool) {
        return hasActiveProposal[proposer];
    }
}
