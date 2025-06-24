// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProposalRegistry
 * @dev A professional and auditable smart contract to manage OCOS DAO proposals,
 * including metadata registration, IPFS hashes, and governance tracking.
 */
contract ProposalRegistry {
    struct Proposal {
        uint256 id;
        string title;
        string ipfsHash;
        address proposer;
        uint256 timestamp;
        bool finalized;
    }

    mapping(uint256 => Proposal) private proposals;
    uint256 private proposalCounter;

    event ProposalSubmitted(
        uint256 indexed id,
        address indexed proposer,
        string title,
        string ipfsHash,
        uint256 timestamp
    );

    event ProposalFinalized(
        uint256 indexed id,
        uint256 timestamp
    );

    modifier validProposalId(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCounter, "Invalid proposal ID");
        _;
    }

    /**
     * @dev Submits a new proposal to the registry.
     * @param title The title of the proposal.
     * @param ipfsHash The IPFS hash of the off-chain proposal document.
     */
    function submitProposal(string calldata title, string calldata ipfsHash) external {
        require(bytes(title).length > 0, "Title required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");

        proposalCounter++;
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: title,
            ipfsHash: ipfsHash,
            proposer: msg.sender,
            timestamp: block.timestamp,
            finalized: false
        });

        emit ProposalSubmitted(proposalCounter, msg.sender, title, ipfsHash, block.timestamp);
    }

    /**
     * @dev Finalizes a proposal, locking it for voting.
     * @param proposalId The ID of the proposal to finalize.
     */
    function finalizeProposal(uint256 proposalId) external validProposalId(proposalId) {
        Proposal storage p = proposals[proposalId];
        require(!p.finalized, "Already finalized");
        require(p.proposer == msg.sender, "Only proposer can finalize");

        p.finalized = true;

        emit ProposalFinalized(proposalId, block.timestamp);
    }

    /**
     * @dev Returns proposal details.
     * @param proposalId The ID of the proposal.
     */
    function getProposal(uint256 proposalId)
        external
        view
        validProposalId(proposalId)
        returns (
            uint256 id,
            string memory title,
            string memory ipfsHash,
            address proposer,
            uint256 timestamp,
            bool finalized
        )
    {
        Proposal storage p = proposals[proposalId];
        return (p.id, p.title, p.ipfsHash, p.proposer, p.timestamp, p.finalized);
    }

    /**
     * @dev Returns the total number of proposals submitted.
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCounter;
    }
}
