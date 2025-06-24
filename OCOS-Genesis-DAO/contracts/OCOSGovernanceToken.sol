// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title OCOS Governance Token
/// @notice Token used for governance voting within OCOS DAO
/// @dev Built on OpenZeppelin ERC20Votes for full snapshot voting
contract OCOSGovernanceToken is ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @notice Max supply cap for OGOV tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor(address dao) 
        ERC20("OCOS Governance Token", "OGOV") 
        ERC20Permit("OCOS Governance Token") 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, dao);
        _grantRole(MINTER_ROLE, dao);
        _grantRole(BURNER_ROLE, dao);
    }

    /// @notice Mint new tokens to an address (DAO-controlled)
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }

    /// @notice Burn tokens from an address (DAO-controlled)
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    // The following overrides are required by Solidity:
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
