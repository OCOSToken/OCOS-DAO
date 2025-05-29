require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    bsctestnet: {
      url: process.env.BSCTESTNET_RPC || "",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    },
    bsc: {
      url: process.env.BSC_RPC || "",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || ""
    }
  }
};
