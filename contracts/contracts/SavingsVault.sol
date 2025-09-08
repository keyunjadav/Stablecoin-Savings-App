// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockUSDC.sol";

/// @title SavingsVault
/// @notice Minimal vault that accepts a single stablecoin and tracks shares.
/// @dev Protocol adapters are stubs—wire to Aave/Compound in adapters/.
contract SavingsVault {
    IERC20 public immutable asset; // e.g., USDC
    string public name = "Stablecoin Savings Vault";
    string public symbol = "svUSDC";

    uint256 public totalAssets;
    uint256 public totalShares;

    mapping(address => uint256) public balanceOf;

    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);

    constructor(address _asset) {
        require(_asset != address(0), "asset=0");
        asset = IERC20(_asset);
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        if (totalShares == 0 || totalAssets == 0) return assets;
        return (assets * totalShares) / totalAssets;
    }

    function previewWithdraw(uint256 shares) public view returns (uint256) {
        if (totalShares == 0 || totalAssets == 0) return 0;
        return (shares * totalAssets) / totalShares;
    }

    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        require(assets > 0, "zero assets");
        // Pull tokens
        require(asset.transferFrom(msg.sender, address(this), assets), "transferFrom failed");

        // Mint shares
        shares = previewDeposit(assets);
        totalAssets += assets;
        totalShares += shares;
        balanceOf[receiver] += shares;

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function withdraw(uint256 shares, address receiver) external returns (uint256 assetsOut) {
        require(shares > 0, "zero shares");
        require(balanceOf[msg.sender] >= shares, "insufficient shares");

        assetsOut = previewWithdraw(shares);
        balanceOf[msg.sender] -= shares;
        totalShares -= shares;
        totalAssets -= assetsOut;

        require(asset.transfer(receiver, assetsOut), "transfer failed");
        emit Withdraw(msg.sender, receiver, assetsOut, shares);
    }

    // ---- Simulated yield (for local demo) ----
    function simulateYield(uint256 amount) external {
        // Mint pretend yield into the vault to move exchange rate
        MockUSDC(address(asset)).faucet(address(this), amount);
        totalAssets += amount;
    }
}
