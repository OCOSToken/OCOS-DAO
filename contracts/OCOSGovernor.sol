// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @title OCOSGovernor
 * @author OCOS
 * @notice DAO contract that manages proposals, voting, and execution logic for the OCOS ecosystem.
 * @dev Inherits OpenZeppelin Governor modules and connects to Timelock and ERC20Votes token.
 */
contract OCOSGovernor is Governor, 
                        GovernorSettings, 
                        GovernorVotes, 
                        GovernorVotesQuorumFraction, 
                        GovernorTimelockControl {

    constructor(ERC20Votes _token, TimelockController _timelock)
        Governor("OCOSGovernor")
        GovernorSettings(
            1 /* Voting delay: 1 block */,
            6570 /* Voting period: ~1 day */,
            100000e18 /* Proposal threshold: 100,000 OCOS */
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {}

    // Return voting delay in blocks
    function votingDelay() public view override returns (uint256) {
        return super.votingDelay();
    }

    // Return voting period in blocks
    function votingPeriod() public view override returns (uint256) {
        return super.votingPeriod();
    }

    // Return quorum requirement
    function quorum(uint256 blockNumber) public view override returns (uint256) {
        return super.quorum(blockNumber);
    }

    // Returns current state of a proposal
    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    // Create a new proposal
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    // Execute approved proposal
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    // Cancel proposal (if needed)
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    // Returns address that will execute proposals
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    // Interface support
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
