// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OcosToken
 * @dev OCOS DAO's official ERC20 token for the S47 Legacy Protocol.
 * Fixed supply, burnable, pausable, and fully ownership-controlled.
 */
contract OcosToken is ERC20Burnable, Pausable, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 1e18;

    /**
     * @dev Deploys the OCOS token and mints the entire supply to the treasury address.
     * @param treasury The address that will receive the initial supply.
     */
    constructor(address treasury) ERC20("OCOS Token", "OCOS") {
        require(treasury != address(0), "Treasury address required");
        _mint(treasury, INITIAL_SUPPLY);
    }

    /**
     * @dev Allows the owner to pause all token transfers (for security/governance events).
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Allows the owner to unpause all token transfers.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Standard transfer hook that checks for pause status.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
