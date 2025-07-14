// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract OcosDAO {
    IERC20 public governanceToken;   // DAO səsvermə tokeni (məs: OCOS, S47, sDAO və s.)

    struct Proposal {
        address proposer;
        string description;
        bytes callData;
        address target;
        uint256 value;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    uint256 public votingPeriod = 5760; // ~1 gün (BSC-də 3s/block)
    uint256 public proposalThreshold = 1000 * 1e18; // Minimum token sahibi olmaq

    event ProposalCreated(uint256 proposalId, address proposer, string description, address target, uint256 value);
    event Voted(uint256 proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 proposalId);
    event ProposalCanceled(uint256 proposalId);

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    function propose(string calldata description, address target, bytes calldata callData, uint256 value) external returns (uint256) {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Not enough tokens to propose");
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.proposer = msg.sender;
        p.description = description;
        p.callData = callData;
        p.target = target;
        p.value = value;
        p.startBlock = block.number;
        p.endBlock = block.number + votingPeriod;
        emit ProposalCreated(proposalCount, msg.sender, description, target, value);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.number >= p.startBlock && block.number <= p.endBlock, "Voting is closed");
        require(!p.hasVoted[msg.sender], "Already voted");
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }
        p.hasVoted[msg.sender] = true;
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(!p.canceled, "Canceled");
        require(block.number > p.endBlock, "Voting not ended");
        require(p.forVotes > p.againstVotes, "Proposal rejected");
        p.executed = true;
        (bool success, ) = p.target.call{value: p.value}(p.callData);
        require(success, "Execution failed");
        emit ProposalExecuted(proposalId);
    }

    function cancel(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(msg.sender == p.proposer, "Only proposer can cancel");
        require(!p.executed, "Already executed");
        p.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    // Setters for DAO parameters (could be locked to only governance calls)
    function setVotingPeriod(uint256 newPeriod) external {
        votingPeriod = newPeriod;
    }

    function setProposalThreshold(uint256 newThreshold) external {
        proposalThreshold = newThreshold;
    }

    receive() external payable {} // Allows contract to receive ETH/BNB
}
