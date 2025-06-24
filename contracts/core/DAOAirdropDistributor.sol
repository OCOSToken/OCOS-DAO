// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title DAOAirdropDistributor
/// @notice Distributes DAO-approved token rewards to eligible members using a Merkle root
/// @dev This contract uses MerkleProof for efficient eligibility validation
contract DAOAirdropDistributor {
    address public admin;
    IERC20 public rewardToken;
    bytes32 public merkleRoot;
    bool public isActive;

    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed claimant, uint256 amount);
    event AirdropActivated(bytes32 root);
    event AirdropDeactivated();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor(address tokenAddress) {
        admin = msg.sender;
        rewardToken = IERC20(tokenAddress);
    }

    /// @notice Set the merkle root hash (one-time or rotationally by DAO)
    function setMerkleRoot(bytes32 _root) external onlyAdmin {
        merkleRoot = _root;
        isActive = true;
        emit AirdropActivated(_root);
    }

    /// @notice Disable airdrop (if voting or conditions change)
    function deactivateAirdrop() external onlyAdmin {
        isActive = false;
        emit AirdropDeactivated();
    }

    /// @notice Claim tokens if proof is valid
    /// @param amount Number of tokens eligible for claim
    /// @param proof Merkle proof array
    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(isActive, "Airdrop is not active");
        require(!hasClaimed[msg.sender], "Already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        hasClaimed[msg.sender] = true;
        require(rewardToken.transfer(msg.sender, amount), "Token transfer failed");

        emit Claimed(msg.sender, amount);
    }

    /// @notice Emergency withdrawal in case of wrong root or failure
    function emergencyWithdraw(address to, uint256 amount) external onlyAdmin {
        require(rewardToken.transfer(to, amount), "Withdraw failed");
    }
}
