import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Mock = await ethers.getContractFactory("MockUSDC");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  const mockAddr = await mock.getAddress();
  console.log("MockUSDC:", mockAddr);

  const Vault = await ethers.getContractFactory("SavingsVault");
  const vault = await Vault.deploy(mockAddr);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("SavingsVault:", vaultAddr);

  // fund deployer with mock
  const decimals = 6;
  const amount = 100_000 * (10 ** decimals);
  const faucetTx = await mock.faucet(deployer.address, amount);
  await faucetTx.wait();
  console.log("Faucet funded:", amount, "mUSDC");

  console.log("DONE. Set frontend env:");
  console.log("VITE_STABLECOIN_ADDRESS=", mockAddr);
  console.log("VITE_VAULT_ADDRESS=", vaultAddr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
