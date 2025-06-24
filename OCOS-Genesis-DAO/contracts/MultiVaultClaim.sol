// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiVaultClaim
 * @author OCOS DAO
 * @notice Enables batch claim operations for multiple vault indices securely.
 */

contract MultiVaultClaim {
    address public daoAdmin;

    mapping(uint256 => bool) private claimedVaults;
    mapping(uint256 => address) private vaultOwners;
    
    event VaultClaimed(uint256 indexed vaultId, address indexed claimant);

    modifier onlyAdmin() {
        require(msg.sender == daoAdmin, "Unauthorized: Admin only");
        _;
    }

    constructor() {
        daoAdmin = msg.sender;
    }

    /**
     * @notice Sets the designated owner for a vault index.
     * @dev Can only be called by DAO admin.
     */
    function assignVault(uint256 vaultId, address user) external onlyAdmin {
        require(vaultOwners[vaultId] == address(0), "Vault already assigned");
        vaultOwners[vaultId] = user;
    }

    /**
     * @notice Allows batch claim of multiple vaults if caller owns them.
     * @param vaultIds Array of vault indexes to claim.
     */
    function batchClaim(uint256[] calldata vaultIds) external {
        for (uint256 i = 0; i < vaultIds.length; i++) {
            uint256 vaultId = vaultIds[i];

            require(!claimedVaults[vaultId], "Vault already claimed");
            require(vaultOwners[vaultId] == msg.sender, "Not the designated owner");

            claimedVaults[vaultId] = true;
            emit VaultClaimed(vaultId, msg.sender);
        }
    }

    /**
     * @notice Checks if a vault is already claimed.
     */
    function isClaimed(uint256 vaultId) external view returns (bool) {
        return claimedVaults[vaultId];
    }

    /**
     * @notice Returns the registered owner of a vault ID.
     */
    function getVaultOwner(uint256 vaultId) external view returns (address) {
        return vaultOwners[vaultId];
    }

    /**
     * @notice Transfers DAO admin role to another address.
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        daoAdmin = newAdmin;
    }
}
