// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DAOGovernanceKernel
 * @notice Core DAO logic that automatically evaluates, executes, and updates DAO state based on approved proposals.
 * @dev Integrates with DAOParameterCore and ProposalRegistry contracts.
 */

interface IProposalRegistry {
    function getProposal(uint256 id) external view returns (
        string memory title,
        string memory ipfsHash,
        uint256 createdAt,
        uint256 yesVotes,
        uint256 noVotes,
        bool executed
    );
    function markExecuted(uint256 id) external;
    function totalVotes(uint256 id) external view returns (uint256);
}

interface IDAOParameterCore {
    function getParam(string calldata key) external view returns (uint256);
    function setParam(string calldata key, uint256 value) external;
}

contract DAOGovernanceKernel {
    address public proposalRegistry;
    address public parameterCore;
    address public daoAuthority;

    mapping(uint256 => bool) public isQueued;

    event ProposalQueued(uint256 indexed proposalId);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyDAO() {
        require(msg.sender == daoAuthority, "Not authorized");
        _;
    }

    constructor(address _proposalRegistry, address _parameterCore, address _daoAuthority) {
        proposalRegistry = _proposalRegistry;
        parameterCore = _parameterCore;
        daoAuthority = _daoAuthority;
    }

    /// @notice Queues a proposal for automatic execution
    function queueProposal(uint256 proposalId) external onlyDAO {
        require(!isQueued[proposalId], "Already queued");
        isQueued[proposalId] = true;
        emit ProposalQueued(proposalId);
    }

    /// @notice Publicly callable executor that evaluates queued proposals and applies results
    function executeProposal(uint256 proposalId, string calldata paramKey, uint256 newValue) external {
        require(isQueued[proposalId], "Proposal not queued");

        (
            ,
            ,
            uint256 createdAt,
            uint256 yesVotes,
            uint256 noVotes,
            bool executed
        ) = IProposalRegistry(proposalRegistry).getProposal(proposalId);

        require(!executed, "Already executed");

        uint256 minQuorum = IDAOParameterCore(parameterCore).getParam("minQuorum");
        uint256 cooldown = IDAOParameterCore(parameterCore).getParam("proposalCooldown");
        uint256 totalVotes = IProposalRegistry(proposalRegistry).totalVotes(proposalId);

        require(block.timestamp >= createdAt + cooldown, "Cooldown active");
        require(totalVotes >= minQuorum, "Quorum not met");
        require(yesVotes > noVotes, "Proposal rejected by vote");

        // Execute parameter change
        IDAOParameterCore(parameterCore).setParam(paramKey, newValue);
        IProposalRegistry(proposalRegistry).markExecuted(proposalId);
        isQueued[proposalId] = false;

        emit ProposalExecuted(proposalId);
    }

    /// @notice Allows DAO to update addresses of dependencies
    function updateDependency(string calldata which, address newAddr) external onlyDAO {
        if (keccak256(bytes(which)) == keccak256("proposalRegistry")) {
            proposalRegistry = newAddr;
        } else if (keccak256(bytes(which)) == keccak256("parameterCore")) {
            parameterCore = newAddr;
        } else if (keccak256(bytes(which)) == keccak256("daoAuthority")) {
            daoAuthority = newAddr;
        } else {
            revert("Unknown dependency");
        }
    }

    /// @notice Returns whether a proposal is currently in execution queue
    function isProposalQueued(uint256 id) external view returns (bool) {
        return isQueued[id];
    }
}
