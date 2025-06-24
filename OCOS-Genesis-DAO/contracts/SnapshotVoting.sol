// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Snapshot-Based DAO Voting Contract
/// @notice Enables historical balance-based voting via snapshot mechanism for OCOS DAO
contract SnapshotVoting is Ownable {
    IERC20 public governanceToken;

    uint256 public snapshotId;
    uint256 public proposalCount;

    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => uint256)) public snapshotBalances;

    event SnapshotTaken(uint256 snapshotId);
    event ProposalCreated(uint256 proposalId, string description, uint256 deadline);
    event Voted(address indexed voter, uint256 proposalId, bool support);
    event ProposalExecuted(uint256 proposalId, bool passed);

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    /// @notice Takes a snapshot of current balances (manual input required per DAO address)
    function recordSnapshot(address[] calldata voters) external onlyOwner {
        snapshotId++;
        for (uint256 i = 0; i < voters.length; i++) {
            snapshotBalances[voters[i]][snapshotId] = governanceToken.balanceOf(voters[i]);
        }
        emit SnapshotTaken(snapshotId);
    }

    /// @notice Create a new voting proposal
    function createProposal(string calldata description, uint256 durationSeconds) external onlyOwner {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.description = description;
        p.deadline = block.timestamp + durationSeconds;

        emit ProposalCreated(proposalCount, description, p.deadline);
    }

    /// @notice Vote on a proposal using snapshot balance
    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.deadline, "Voting ended");
        require(!p.hasVoted[msg.sender], "Already voted");

        uint256 weight = snapshotBalances[msg.sender][snapshotId];
        require(weight > 0, "No voting power");

        if (support) {
            p.yesVotes += weight;
        } else {
            p.noVotes += weight;
        }
        p.hasVoted[msg.sender] = true;

        emit Voted(msg.sender, proposalId, support);
    }

    /// @notice Finalize proposal after deadline
    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(block.timestamp >= p.deadline, "Voting not ended");

        bool passed = p.yesVotes > p.noVotes;
        p.executed = true;

        emit ProposalExecuted(proposalId, passed);
    }

    /// @notice View if a voter has voted on a proposal
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }

    /// @notice View snapshot balance of an address
    function getSnapshotBalance(address voter, uint256 snapId) external view returns (uint256) {
        return snapshotBalances[voter][snapId];
    }
}
