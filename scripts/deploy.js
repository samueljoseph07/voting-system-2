const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const candidates = ["Alice", "Bob", "Charlie"];
  const voting = await Voting.deploy(candidates);

  // Wait for the contract deployment to complete
  await voting.waitForDeployment();

  // Get the contract address (in Ethers v6, address is accessed with getAddress())
  const contractAddress = await voting.getAddress();
  console.log("Voting contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
