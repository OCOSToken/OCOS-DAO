// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title VaultS47
 * @dev Symbolic smart contract to register and manage dormant B7C addresses under DAO governance
 * Author: OCOS DAO — Confidential Legacy Framework
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IDAOAuthority {
    function isProposalApproved(uint256 proposalId) external view returns (bool);
    function isDAO(address account) external view returns (bool);
}

contract VaultS47 is Ownable {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    EnumerableSet.Bytes32Set private legacyVault;
    mapping(bytes32 => bool) public unlockedStatus;

    address public daoContract;
    bool public vaultInitialized = false;

    event LegacyAddressAdded(bytes32 indexed legacyHash);
    event VaultUnlocked(bytes32 indexed legacyHash);

    modifier onlyDAO() {
        require(IDAOAuthority(daoContract).isDAO(msg.sender), "Not authorized DAO address");
        _;
    }

    constructor(address _daoContract) {
        daoContract = _daoContract;
    }

    function initializeVault(bytes32[] calldata initialHashes) external onlyDAO {
        require(!vaultInitialized, "Vault already initialized");
        for (uint256 i = 0; i < initialHashes.length; i++) {
            legacyVault.add(initialHashes[i]);
            emit LegacyAddressAdded(initialHashes[i]);
        }
        vaultInitialized = true;
    }

    function addLegacyAddress(bytes32 legacyHash) external onlyDAO {
        require(legacyVault.add(legacyHash), "Already exists");
        emit LegacyAddressAdded(legacyHash);
    }

    function proposeUnlock(bytes32 legacyHash, uint256 proposalId) external onlyDAO {
        require(legacyVault.contains(legacyHash), "Hash not in vault");
        require(!unlockedStatus[legacyHash], "Already unlocked");
        require(IDAOAuthority(daoContract).isProposalApproved(proposalId), "Proposal not approved");

        unlockedStatus[legacyHash] = true;
        emit VaultUnlocked(legacyHash);
    }

    function isAddressInVault(bytes32 legacyHash) public view returns (bool) {
        return legacyVault.contains(legacyHash);
    }

    function isUnlocked(bytes32 legacyHash) public view returns (bool) {
        return unlockedStatus[legacyHash];
    }

    function getTotalVaultCount() external view returns (uint256) {
        return legacyVault.length();
    }

    function getVaultHashAt(uint256 index) external view returns (bytes32) {
        return legacyVault.at(index);
    }

    function updateDAOContract(address newDAO) external onlyOwner {
        daoContract = newDAO;
    }
}
