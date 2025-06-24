// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title S47ProofVerifier
/// @notice Verifies cryptographic claims of control over legacy BTC (S47) addresses for DAO eligibility
/// @dev This contract uses Bitcoin-style message signing verification via address recovery

interface ISnapshotDAO {
    function isMember(address user) external view returns (bool);
}

contract S47ProofVerifier {
    address public daoAuthority;
    mapping(address => bool) public verified;
    mapping(bytes32 => bool) public usedProofHashes;

    event ProofVerified(address indexed claimant, string btcAddress, bytes32 proofHash);
    event ProofRejected(address indexed claimant, string reason);

    constructor(address _daoAuthority) {
        daoAuthority = _daoAuthority;
    }

    /// @notice Verifies ownership of an S47 address via signed message
    /// @param message Plaintext message signed by claimant (e.g. "I control S47 address: 1A1z...")
    /// @param signature Signature generated from BTC wallet (standard message prefix used)
    /// @param btcAddress Original BTC address as string (for event log clarity)
    function verifyS47Proof(
        string memory message,
        bytes memory signature,
        string memory btcAddress
    ) external {
        bytes32 messageHash = keccak256(abi.encodePacked("\x18Bitcoin Signed Message:\n", uintToString(bytes(message).length), message));
        address recovered = recoverAddress(messageHash, signature);

        bytes32 proofHash = keccak256(abi.encodePacked(message, signature, btcAddress));

        require(!usedProofHashes[proofHash], "Duplicate proof hash detected");
        require(recovered == msg.sender, "Recovered address mismatch");

        verified[msg.sender] = true;
        usedProofHashes[proofHash] = true;

        emit ProofVerified(msg.sender, btcAddress, proofHash);
    }

    /// @dev Internal function to recover address from signed message hash
    function recoverAddress(bytes32 hash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid v value");
        return ecrecover(hash, v, r, s);
    }

    /// @dev Helper function to convert uint to string
    function uintToString(uint v) internal pure returns (string memory str) {
        if (v == 0) return "0";
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1];
        }
        str = string(s);
    }

    /// @notice Returns true if user has passed proof verification
    function isVerified(address user) external view returns (bool) {
        return verified[user];
    }
}
