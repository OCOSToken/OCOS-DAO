// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DAOParameterCore
/// @notice Manages mutable DAO parameters via DAO-approved proposals only
/// @dev Designed for use in self-governing DAO systems (e.g., OCOS DAO)

contract DAOParameterCore {
    address public daoGovernor;

    // Mapping for key-value configuration
    mapping(bytes32 => uint256) private numericParams;
    mapping(bytes32 => address) private addressParams;
    mapping(bytes32 => bool) private boolParams;

    event ParameterUpdated(bytes32 indexed key, string paramType, bytes value);

    modifier onlyDAO() {
        require(msg.sender == daoGovernor, "Not authorized: DAO only");
        _;
    }

    constructor(address _daoGovernor) {
        daoGovernor = _daoGovernor;
    }

    // ===== Numeric Parameter Management =====
    function setUintParam(string memory key, uint256 value) external onlyDAO {
        bytes32 hashed = keccak256(abi.encodePacked(key));
        numericParams[hashed] = value;
        emit ParameterUpdated(hashed, "uint256", abi.encode(value));
    }

    function getUintParam(string memory key) external view returns (uint256) {
        return numericParams[keccak256(abi.encodePacked(key))];
    }

    // ===== Address Parameter Management =====
    function setAddressParam(string memory key, address value) external onlyDAO {
        bytes32 hashed = keccak256(abi.encodePacked(key));
        addressParams[hashed] = value;
        emit ParameterUpdated(hashed, "address", abi.encode(value));
    }

    function getAddressParam(string memory key) external view returns (address) {
        return addressParams[keccak256(abi.encodePacked(key))];
    }

    // ===== Boolean Parameter Management =====
    function setBoolParam(string memory key, bool value) external onlyDAO {
        bytes32 hashed = keccak256(abi.encodePacked(key));
        boolParams[hashed] = value;
        emit ParameterUpdated(hashed, "bool", abi.encode(value));
    }

    function getBoolParam(string memory key) external view returns (bool) {
        return boolParams[keccak256(abi.encodePacked(key))];
    }

    // ===== DAO Admin Control =====
    function transferGovernance(address newDAO) external onlyDAO {
        daoGovernor = newDAO;
    }
}
