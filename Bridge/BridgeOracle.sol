// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title OCOS Cross-Chain Bridge Oracle
/// @notice Decentralized on-chain oracle for confirming cross-chain swap events

contract BridgeOracle {
    address public daoMultiSig;
    mapping(address => bool) public oracles; // Oracle node operator addresses
    uint256 public oracleCount;
    uint256 public requiredConfirmations; // e.g. 2-out-of-3

    struct SwapProof {
        address user;
        address fromToken;
        uint256 amount;
        string targetBtcAddress;
        string sourceChain;
        uint256 nonce;
        uint256 confirmations;
        mapping(address => bool) confirmedBy;
        bool executed;
    }

    mapping(bytes32 => SwapProof) public swapProofs;

    event OracleAdded(address indexed oracle);
    event OracleRemoved(address indexed oracle);
    event SwapConfirmed(bytes32 indexed proofHash, address indexed oracle, uint256 confirmations);
    event SwapExecuted(bytes32 indexed proofHash, address indexed user, string btcAddress, uint256 amount);

    modifier onlyDAO() {
        require(msg.sender == daoMultiSig, "Only DAO");
        _;
    }

    modifier onlyOracle() {
        require(oracles[msg.sender], "Not authorized oracle");
        _;
    }

    constructor(address _daoMultiSig, address[] memory initialOracles, uint256 _required) {
        daoMultiSig = _daoMultiSig;
        requiredConfirmations = _required;
        for (uint i = 0; i < initialOracles.length; i++) {
            oracles[initialOracles[i]] = true;
        }
        oracleCount = initialOracles.length;
    }

    function addOracle(address oracle) external onlyDAO {
        require(!oracles[oracle], "Already oracle");
        oracles[oracle] = true;
        oracleCount += 1;
        emit OracleAdded(oracle);
    }

    function removeOracle(address oracle) external onlyDAO {
        require(oracles[oracle], "Not oracle");
        oracles[oracle] = false;
        oracleCount -= 1;
        emit OracleRemoved(oracle);
    }

    // User or off-chain backend submits swap event proof (unique by hash)
    function submitSwapProof(
        address user,
        address fromToken,
        uint256 amount,
        string memory btcAddress,
        string memory sourceChain,
        uint256 nonce
    ) public returns (bytes32) {
        bytes32 proofHash = keccak256(abi.encodePacked(user, fromToken, amount, btcAddress, sourceChain, nonce));
        SwapProof storage proof = swapProofs[proofHash];
        require(proof.user == address(0), "Proof already submitted");
        proof.user = user;
        proof.fromToken = fromToken;
        proof.amount = amount;
        proof.targetBtcAddress = btcAddress;
        proof.sourceChain = sourceChain;
        proof.nonce = nonce;
        proof.confirmations = 0;
        proof.executed = false;
        return proofHash;
    }

    // Oracle nodes confirm swap proof
    function confirmSwap(bytes32 proofHash) external onlyOracle {
        SwapProof storage proof = swapProofs[proofHash];
        require(proof.user != address(0), "Proof not found");
        require(!proof.executed, "Already executed");
        require(!proof.confirmedBy[msg.sender], "Already confirmed");
        proof.confirmedBy[msg.sender] = true;
        proof.confirmations += 1;
        emit SwapConfirmed(proofHash, msg.sender, proof.confirmations);

        if (proof.confirmations >= requiredConfirmations) {
            proof.executed = true;
            emit SwapExecuted(proofHash, proof.user, proof.targetBtcAddress, proof.amount);
            // Off-chain backend listens to SwapExecuted event, triggers BTC payout from pool
        }
    }

    function setRequiredConfirmations(uint256 newRequired) external onlyDAO {
        require(newRequired > 0 && newRequired <= oracleCount, "Invalid value");
        requiredConfirmations = newRequired;
    }

    function setDaoMultiSig(address newDao) external onlyDAO {
        daoMultiSig = newDao;
    }
}
