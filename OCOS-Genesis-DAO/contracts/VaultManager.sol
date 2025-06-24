// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VaultManager - OCOS DAO vault index and claim tracker for S47 legacy reserve
/// @notice Handles verification, status tracking, and access logs for 47,000 AES-encrypted vaults

contract VaultManager {
    address public admin;
    uint256 public totalVaults = 47000;

    mapping(uint256 => bool) public claimed;
    mapping(uint256 => bytes32) public vaultHashes;
    mapping(uint256 => address) public claimedBy;
    mapping(uint256 => uint256) public claimTimestamps;

    event VaultInitialized(uint256 indexed vaultId, bytes32 indexed hash);
    event VaultClaimed(uint256 indexed vaultId, address indexed claimer, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Initialize a vault slot with its file hash
    function setVaultHash(uint256 vaultId, bytes32 hash) external onlyAdmin {
        require(vaultId > 0 && vaultId <= totalVaults, "Invalid vault ID");
        require(vaultHashes[vaultId] == 0, "Already initialized");
        vaultHashes[vaultId] = hash;
        emit VaultInitialized(vaultId, hash);
    }

    /// @notice View status of a vault (claimed or not)
    function isClaimed(uint256 vaultId) external view returns (bool) {
        require(vaultId > 0 && vaultId <= totalVaults, "Invalid vault ID");
        return claimed[vaultId];
    }

    /// @notice Claim a vault if not already claimed
    function claimVault(uint256 vaultId) external {
        require(vaultId > 0 && vaultId <= totalVaults, "Invalid vault ID");
        require(!claimed[vaultId], "Vault already claimed");

        claimed[vaultId] = true;
        claimedBy[vaultId] = msg.sender;
        claimTimestamps[vaultId] = block.timestamp;

        emit VaultClaimed(vaultId, msg.sender, block.timestamp);
    }

    /// @notice Get full claim record
    function getClaimDetails(uint256 vaultId) external view returns (
        bool isClaimed_,
        address claimedBy_,
        uint256 timestamp
    ) {
        require(vaultId > 0 && vaultId <= totalVaults, "Invalid vault ID");
        return (
            claimed[vaultId],
            claimedBy[vaultId],
            claimTimestamps[vaultId]
        );
    }

    /// @notice Admin override to transfer ownership
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
}
