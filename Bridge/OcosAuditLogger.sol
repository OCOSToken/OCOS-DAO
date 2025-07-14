// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OcosAuditLogger {
    address public owner;

    // Events for each critical operation
    event DepositLogged(
        address indexed user,
        address indexed token,
        uint256 amount,
        string ref,
        uint256 timestamp
    );

    event WithdrawLogged(
        address indexed user,
        address indexed token,
        uint256 amount,
        string ref,
        uint256 timestamp
    );

    event SwapLogged(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        string fromChain,
        string toChain,
        uint256 timestamp
    );

    event CustomAction(
        address indexed user,
        string action,
        string ref,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Log a deposit (can be called from swap/bridge/staking contract)
    function logDeposit(address user, address token, uint256 amount, string calldata ref) external onlyOwner {
        emit DepositLogged(user, token, amount, ref, block.timestamp);
    }

    // Log a withdraw
    function logWithdraw(address user, address token, uint256 amount, string calldata ref) external onlyOwner {
        emit WithdrawLogged(user, token, amount, ref, block.timestamp);
    }

    // Log a swap event (cross-chain, etc.)
    function logSwap(
        address user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        string calldata fromChain,
        string calldata toChain
    ) external onlyOwner {
        emit SwapLogged(user, tokenIn, tokenOut, amountIn, amountOut, fromChain, toChain, block.timestamp);
    }

    // Log any custom action (for governance, upgrades, etc.)
    function logCustomAction(address user, string calldata action, string calldata ref) external onlyOwner {
        emit CustomAction(user, action, ref, block.timestamp);
    }

    // Ownership transfer (in case of DAO upgrade)
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
