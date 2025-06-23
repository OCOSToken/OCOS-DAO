```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title OCOSGenesisDAO
 * @dev Immutable and decentralized DAO contract to govern symbolic BTC vault (S47 Legacy)
 * Only OCOS token holders can vote and execute governance decisions
 */

interface IOCOSToken {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract OCOSGenesisDAO {
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteYes;
        uint256 voteNo;
        uint256 deadline;
        bool executed;
        mapping(address => bool) voted;
    }

    address public immutable tokenAddress;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public verifiedHolder;

    event ProposalCreated(uint256 indexed id, string description);
    event VoteCasted(uint256 indexed id, address voter, bool vote);
    event ProposalExecuted(uint256 indexed id);

    modifier onlyVerifiedHolder() {
        require(IOCOSToken(tokenAddress).balanceOf(msg.sender) > 0, "Not a token holder");
        _;
    }

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function createProposal(string calldata _desc, uint256 _duration) external onlyVerifiedHolder {
        require(_duration > 0, "Invalid duration");

        Proposal storage p = proposals[++proposalCount];
        p.id = proposalCount;
        p.description = _desc;
        p.deadline = block.timestamp + _duration;

        emit ProposalCreated(p.id, _desc);
    }

    function vote(uint256 _proposalId, bool _support) external onlyVerifiedHolder {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!p.voted[msg.sender], "Already voted");

        p.voted[msg.sender] = true;
        if (_support) {
            p.voteYes += 1;
        } else {
            p.voteNo += 1;
        }

        emit VoteCasted(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp > p.deadline, "Voting not ended");
        require(!p.executed, "Already executed");
        require(p.voteYes > p.voteNo, "Proposal rejected");

        p.executed = true;
        emit ProposalExecuted(_proposalId);
        // Further on-chain execution logic can be extended by modular contracts
    }

    function verifyHolder(address user) external view returns (bool) {
        return IOCOSToken(tokenAddress).balanceOf(user) > 0;
    }
}
```
