// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AutoExecProposal
/// @notice Enables on-chain execution of DAO-approved parameter change proposals
/// @dev Works with DAOParameterCore and OCOSGenesisDAO logic

interface IParameterCore {
    function setParam(string calldata key, uint256 value) external;
}

interface IDAOCore {
    function hasProposalPassed(uint256 proposalId) external view returns (bool);
    function getProposalMeta(uint256 proposalId) external view returns (string memory key, uint256 value);
    function markExecuted(uint256 proposalId) external;
    function isProposalExecuted(uint256 proposalId) external view returns (bool);
}

contract AutoExecProposal {
    address public dao;
    address public parameterCore;

    event ProposalExecuted(uint256 indexed proposalId, string paramKey, uint256 newValue);

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can execute");
        _;
    }

    constructor(address _dao, address _parameterCore) {
        dao = _dao;
        parameterCore = _parameterCore;
    }

    /// @notice Automatically executes a passed DAO proposal that modifies a parameter
    /// @param proposalId ID of the DAO proposal approved by quorum
    function execute(uint256 proposalId) external onlyDAO {
        IDAOCore daoContract = IDAOCore(dao);
        require(daoContract.hasProposalPassed(proposalId), "Proposal has not passed");
        require(!daoContract.isProposalExecuted(proposalId), "Already executed");

        (string memory key, uint256 value) = daoContract.getProposalMeta(proposalId);
        
        IParameterCore(parameterCore).setParam(key, value);
        daoContract.markExecuted(proposalId);

        emit ProposalExecuted(proposalId, key, value);
    }

    /// @notice Allows DAO to update reference contract addresses
    function updateModules(address _dao, address _paramCore) external onlyDAO {
        dao = _dao;
        parameterCore = _paramCore;
    }

    /// @notice Returns current linked DAO and parameter module
    function getModules() external view returns (address, address) {
        return (dao, parameterCore);
    }
}
