// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AuditLog
 * @notice On-chain immutable audit trail system for recording DAO and vault actions
 * @author OCOS
 */
contract AuditLog {
    // Struct to hold log entry
    struct LogEntry {
        uint256 timestamp;
        address triggeredBy;
        string category;
        string message;
    }

    // Array to store all log entries
    LogEntry[] private logs;

    // Mapping to track number of logs per category
    mapping(string => uint256) public categoryCount;

    // Event emitted on new log
    event LogWritten(uint256 indexed logId, string category, address indexed triggeredBy, uint256 timestamp);

    /**
     * @notice Writes a new log entry to the audit trail
     * @param category Short identifier for the log (e.g., "VAULT", "DAO", "CLAIM")
     * @param message Human-readable message (stored on-chain)
     */
    function logAction(string memory category, string memory message) external {
        LogEntry memory entry = LogEntry({
            timestamp: block.timestamp,
            triggeredBy: msg.sender,
            category: category,
            message: message
        });

        logs.push(entry);
        categoryCount[category]++;

        emit LogWritten(logs.length - 1, category, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns a specific log entry by ID
     * @param logId Index of the log in the array
     */
    function getLog(uint256 logId) external view returns (uint256, address, string memory, string memory) {
        require(logId < logs.length, "Invalid log ID");
        LogEntry memory entry = logs[logId];
        return (entry.timestamp, entry.triggeredBy, entry.category, entry.message);
    }

    /**
     * @notice Returns total number of log entries
     */
    function totalLogs() external view returns (uint256) {
        return logs.length;
    }

    /**
     * @notice Returns recent log IDs for off-chain indexing
     * @param count Number of most recent logs to retrieve
     */
    function getRecentLogs(uint256 count) external view returns (uint256[] memory) {
        uint256 total = logs.length;
        if (count > total) count = total;

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = total - 1 - i;
        }
        return result;
    }
}
