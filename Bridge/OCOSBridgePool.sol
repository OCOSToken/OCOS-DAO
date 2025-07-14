// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract OCOSBridgePool {
    address public owner;
    address public daoMultiSig; // DAO multi-sig controller
    address public btcPoolManager; // Off-chain BTC pool trigger authority
    IERC20 public OCOS;
    event SwapInitiated(address indexed user, uint256 amount, string targetBtcAddress, string chain, string token, uint256 nonce);
    event PoolManagerUpdated(address indexed oldManager, address indexed newManager);

    mapping(address => bool) public authorizedTokens; // S47, OCOA və s. əlavə etmək üçün

    uint256 public swapNonce = 0;

    modifier onlyDAO() {
        require(msg.sender == daoMultiSig, "Only DAO can operate");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _daoMultiSig, address _OCOS) {
        owner = msg.sender;
        daoMultiSig = _daoMultiSig;
        OCOS = IERC20(_OCOS);
        authorizedTokens[_OCOS] = true;
    }

    // Swap/bridge trigger (user -> pool)
    function swapOCOSforBTC(uint256 amount, string calldata btcAddress) external {
        require(OCOS.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        swapNonce += 1;
        emit SwapInitiated(msg.sender, amount, btcAddress, "BSC", "OCOS", swapNonce);
        // Off-chain agent (btcPoolManager) bu eventi dinləyib BTC pool-dan user-ə BTC göndərir
    }

    // Yeni tokenlər əlavə et (məs. S47, OCOA və s.)
    function addAuthorizedToken(address token) external onlyDAO {
        authorizedTokens[token] = true;
    }

    // Digər chainlər üçün universal swap funksiyası (S47, OCOA və s.)
    function swapTokenForBTC(address token, uint256 amount, string calldata btcAddress, string calldata chain) external {
        require(authorizedTokens[token], "Token not allowed");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        swapNonce += 1;
        emit SwapInitiated(msg.sender, amount, btcAddress, chain, "Custom", swapNonce);
    }

    // Emergency: DAO manager və BTC manager dəyişə bilər
    function setPoolManager(address newManager) external onlyDAO {
        emit PoolManagerUpdated(btcPoolManager, newManager);
        btcPoolManager = newManager;
    }

    function setDAOMultiSig(address newMultiSig) external onlyOwner {
        daoMultiSig = newMultiSig;
    }

    // Withdraw: Yalnız DAO-approved pool manager üçün (BTC çıxışlar yalnız off-chain agentlə)
    function withdrawTokens(address token, address to, uint256 amount) external onlyDAO {
        IERC20(token).transfer(to, amount);
    }
}
