// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TokenLockerSwapBridge {
    address public owner;
    address public daoMultiSig;      // DAO multi-sig address
    address public btcPoolManager;   // Off-chain BTC pool trigger manager

    event TokenLocked(
        address indexed user,
        address indexed token,
        uint256 amount,
        string targetBtcAddress,
        string originChain,
        uint256 nonce
    );
    event EmergencyStopped(address indexed by, uint256 atBlock);
    event EmergencyResumed(address indexed by, uint256 atBlock);

    bool public stopped = false;
    uint256 public lockNonce = 0;

    modifier onlyDAO() {
        require(msg.sender == daoMultiSig, "Only DAO multi-sig allowed");
        _;
    }
    modifier notStopped() {
        require(!stopped, "Contract is paused by DAO");
        _;
    }

    constructor(address _daoMultiSig) {
        owner = msg.sender;
        daoMultiSig = _daoMultiSig;
    }

    function lockTokenForSwap(address token, uint256 amount, string calldata btcAddress, string calldata originChain) external notStopped {
        require(token != address(0), "Token address required");
        require(bytes(btcAddress).length > 15, "BTC address invalid");
        require(amount > 0, "Amount required");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        lockNonce += 1;
        emit TokenLocked(msg.sender, token, amount, btcAddress, originChain, lockNonce);
        // Off-chain bridge agent listens for TokenLocked and triggers BTC payout from pool
    }

    // DAO multi-sig emergency stop (security feature)
    function emergencyStop() external onlyDAO {
        stopped = true;
        emit EmergencyStopped(msg.sender, block.number);
    }

    // DAO can resume contract
    function resume() external onlyDAO {
        stopped = false;
        emit EmergencyResumed(msg.sender, block.number);
    }

    // DAO can withdraw any tokens in contract (to treasury, after swap finished)
    function daoWithdraw(address token, address to, uint256 amount) external onlyDAO {
        IERC20(token).transferFrom(address(this), to, amount);
    }

    // DAO can change multi-sig address
    function setDaoMultiSig(address newDao) external onlyDAO {
        require(newDao != address(0), "Invalid DAO address");
        daoMultiSig = newDao;
    }
}
