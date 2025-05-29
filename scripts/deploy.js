const { ethers } = require("hardhat");

async function main() {
  // Load signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // DAO Parameters
  const MIN_DELAY = 86400; // 24 hours in seconds
  const PROPOSERS = []; // to be updated after deployment
  const EXECUTORS = ["0x0000000000000000000000000000000000000000"]; // open execution

  // Load deployed governance token (OCOS token must be ERC20Votes compatible)
  const OCOSTokenAddress = "0xYourOCOSTokenAddress"; // <-- Replace this with the real address
  const OCOSToken = await ethers.getContractAt("ERC20Votes", OCOSTokenAddress);

  // Deploy Timelock
  const Timelock = await ethers.getContractFactory("OCOSTimelock");
  const timelock = await Timelock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS);
  await timelock.deployed();
  console.log("Timelock deployed to:", timelock.address);

  // Deploy Governor
  const Governor = await ethers.getContractFactory("OCOSGovernor");
  const governor = await Governor.deploy(OCOSToken.address, timelock.address);
  await governor.deployed();
  console.log("Governor deployed to:", governor.address);

  // ✅ You can manually add the governor address as a proposer to the timelock from here if needed.
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
