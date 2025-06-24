// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TimeLockedTreasury
 * @notice A secure treasury contract where funds are locked and only released after DAO-approved delay
 * @dev Used in DAO governance for time-buffered withdrawals, protecting against sudden treasury drains
 */
contract TimeLockedTreasury {
    address public dao;
    uint256 public unlockDelay; // in seconds

    struct WithdrawalRequest {
        address to;
        uint256 amount;
        uint256 unlockTimestamp;
        bool executed;
    }

    uint256 public requestCount;
    mapping(uint256 => WithdrawalRequest) public requests;

    event Deposit(address indexed from, uint256 amount);
    event WithdrawalRequested(uint256 indexed id, address to, uint256 amount, uint256 unlockTime);
    event WithdrawalExecuted(uint256 indexed id);

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can execute");
        _;
    }

    constructor(address _dao, uint256 _unlockDelay) {
        dao = _dao;
        unlockDelay = _unlockDelay; // e.g., 86400 for 24h
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice DAO proposes a withdrawal, which becomes executable after delay
     */
    function requestWithdrawal(address to, uint256 amount) external onlyDAO returns (uint256 id) {
        id = ++requestCount;
        uint256 unlockTime = block.timestamp + unlockDelay;
        requests[id] = WithdrawalRequest({
            to: to,
            amount: amount,
            unlockTimestamp: unlockTime,
            executed: false
        });
        emit WithdrawalRequested(id, to, amount, unlockTime);
    }

    /**
     * @notice Executes a previously requested withdrawal if unlock time has passed
     */
    function executeWithdrawal(uint256 id) external {
        WithdrawalRequest storage request = requests[id];
        require(!request.executed, "Already executed");
        require(block.timestamp >= request.unlockTimestamp, "Unlock time not reached");
        require(address(this).balance >= request.amount, "Insufficient treasury balance");

        request.executed = true;
        payable(request.to).transfer(request.amount);
        emit WithdrawalExecuted(id);
    }

    /**
     * @notice Allows DAO to update delay
     */
    function updateUnlockDelay(uint256 newDelay) external onlyDAO {
        unlockDelay = newDelay;
    }

    function getRequest(uint256 id) external view returns (WithdrawalRequest memory) {
        return requests[id];
    }
}
