import { expect } from "chai";
import { ethers } from "hardhat";

describe("SavingsVault", function () {
  it("deposits and withdraws", async () => {
    const [user] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockUSDC");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();

    const Vault = await ethers.getContractFactory("SavingsVault");
    const vault = await Vault.deploy(await mock.getAddress());
    await vault.waitForDeployment();

    // fund
    await mock.faucet(user.address, 1_000_000n);
    await mock.approve(await vault.getAddress(), 500_000n);

    const prevBal = await mock.balanceOf(user.address);
    await vault.deposit(500_000n, user.address);
    expect(await mock.balanceOf(user.address)).to.equal(prevBal - 500_000n);

    // simulate yield
    await vault.simulateYield(50_000n);

    const shares = await vault.balanceOf(user.address);
    const assetsOut = await vault.previewWithdraw(shares);
    await vault.withdraw(shares, user.address);
    const finalBal = await mock.balanceOf(user.address);
    expect(finalBal).to.be.greaterThan(prevBal);
  });
});
