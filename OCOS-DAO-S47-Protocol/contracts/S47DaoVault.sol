// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./OcosToken.sol";

/**
 * @title S47DaoVault
 * @dev OCOS DAO's vault and voting contract for S47 Legacy Protocol.
 * Manages voting among 47,000 Tale Wallets by OCOS holders and S47 distribution logic.
 */
contract S47DaoVault is Ownable {
    OcosToken public immutable ocosToken;
    uint256 public constant S47_TOTAL = 1_100_000;
    uint256 public constant TALE_WALLET_COUNT = 47000;

    // Info for each Tale Wallet
    struct TaleWallet {
        uint256 voteCount;       // Total OCOS votes received this round
        uint256 s47Allocated;    // S47 units allocated to this wallet (historical)
    }

    // Mapping: walletId => TaleWallet
    mapping(uint256 => TaleWallet) public taleWallets;
    // Mapping: voter address => hasVoted (per round)
    mapping(address => uint256) public lastVotedRound;
    // Current voting round
    uint256 public votingRound;
    // Whether S47 was distributed in this round
    bool public distributedThisRound;

    event Voted(address indexed voter, uint256 indexed walletId, uint256 amount, uint256 round);
    event RoundAdvanced(uint256 newRound);
    event S47Distributed(uint256 round, uint256[] winningWallets, uint256[] distributedAmounts);

    /**
     * @dev Constructor sets OCOS token address
     */
    constructor(address ocosTokenAddress) {
        require(ocosTokenAddress != address(0), "Token address required");
        ocosToken = OcosToken(ocosTokenAddress);
        votingRound = 1;
        distributedThisRound = false;
    }

    /**
     * @dev User votes for a Tale Wallet by staking OCOS tokens (1 OCOS = 1 vote, single vote per round)
     * @param walletId The Tale Wallet ID (0 - 46,999)
     * @param amount Number of OCOS tokens to vote with
     */
    function vote(uint256 walletId, uint256 amount) external {
        require(walletId < TALE_WALLET_COUNT, "Invalid wallet");
        require(lastVotedRound[msg.sender] < votingRound, "Already voted this round");
        require(amount > 0, "Amount must be > 0");
        require(ocosToken.balanceOf(msg.sender) >= amount, "Insufficient OCOS");
        // Transfer OCOS to the vault (locked)
        ocosToken.transferFrom(msg.sender, address(this), amount);
        // Register vote
        taleWallets[walletId].voteCount += amount;
        lastVotedRound[msg.sender] = votingRound;
        emit Voted(msg.sender, walletId, amount, votingRound);
    }

    /**
     * @dev Only owner/DAO can distribute S47 after voting period ends.
     * This sample version splits S47 equally among top N wallets by vote count.
     * For demo: distributes among top 10 wallets, can be modified for DAO rules.
     */
    function distributeS47() external onlyOwner {
        require(!distributedThisRound, "Already distributed this round");
        // 1. Find top 10 Tale Wallets by voteCount
        uint256 N = 10;
        uint256[] memory topWallets = new uint256[](N);
        uint256[] memory topVotes = new uint256[](N);

        // Naive O(n) selection for simplicity; can be optimized for gas
        for (uint256 i = 0; i < TALE_WALLET_COUNT; i++) {
            uint256 votes = taleWallets[i].voteCount;
            for (uint256 j = 0; j < N; j++) {
                if (votes > topVotes[j]) {
                    // Shift lower ranks down
                    for (uint256 k = N - 1; k > j; k--) {
                        topVotes[k] = topVotes[k - 1];
                        topWallets[k] = topWallets[k - 1];
                    }
                    // Insert new top candidate
                    topVotes[j] = votes;
                    topWallets[j] = i;
                    break;
                }
            }
        }

        // 2. Distribute S47 among top wallets (example: 1000 S47 per wallet)
        uint256 s47PerWallet = 1000;
        uint256[] memory distributedAmounts = new uint256[](N);
        for (uint256 i = 0; i < N; i++) {
            taleWallets[topWallets[i]].s47Allocated += s47PerWallet;
            distributedAmounts[i] = s47PerWallet;
        }

        distributedThisRound = true;
        emit S47Distributed(votingRound, topWallets, distributedAmounts);
    }

    /**
     * @dev Starts a new voting round, resetting votes and allowing everyone to vote again.
     * (Typically called after S47 distribution.)
     */
    function advanceRound() external onlyOwner {
        require(distributedThisRound, "Distribute S47 first");
        // Reset all vote counts for new round
        for (uint256 i = 0; i < TALE_WALLET_COUNT; i++) {
            taleWallets[i].voteCount = 0;
        }
        votingRound += 1;
        distributedThisRound = false;
        emit RoundAdvanced(votingRound);
    }

    // ====== Utility View Functions ======

    function getTaleWalletVotes(uint256 walletId) external view returns (uint256) {
        return taleWallets[walletId].voteCount;
    }

    function getTaleWalletS47(uint256 walletId) external view returns (uint256) {
        return taleWallets[walletId].s47Allocated;
    }

    function hasVotedThisRound(address user) external view returns (bool) {
        return lastVotedRound[user] == votingRound;
    }
}
