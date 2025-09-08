# Decentralized Stablecoin Savings App (Starter)

A minimal template for a **Stablecoin Savings** dApp. Users connect a wallet, choose a supported stablecoin (DAI/USDC), and interact with a simple **SavingsVault** contract (upgrade hooks prepared for Aave/Compound). Includes an interest **calculator** and a **performance chart** on the frontend.

> This is a starter you can push to GitHub right away. It compiles out-of-the-box and runs on a local testnet. To connect to Aave/Compound on a public chain, set addresses in `contracts/adapters/` and frontend `src/lib/protocols.ts`.

## Features

- Deposit/withdraw stablecoins (mock ERC20 on local chain; ready to plug Aave/Compound on real networks)
- Interest calculator (APR → APY; projected earnings)
- Vault performance graph (simulated data; replace with subgraph/metrics later)
- Wallet connect (RainbowKit + wagmi)
- Hardhat for contracts + tests
- TypeScript + Vite React UI
- One-click Docker build
- GitHub Actions CI (build & test)

## Quick Start

### 1) Clone & install
```bash
# after you download/unzip the archive (or git clone your repo after pushing)
cd stablecoin-savings-app

# Contracts
cd contracts && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2) Run a local chain & deploy
```bash
# in one terminal
cd contracts
npx hardhat node

# in another terminal (new shell)
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

This deploys:
- `MockUSDC` (for local testing)
- `SavingsVault` configured to accept `MockUSDC`

Copy the deployed addresses from the deploy logs into `frontend/.env.local` as `VITE_VAULT_ADDRESS` and `VITE_STABLECOIN_ADDRESS`.

### 3) Start the frontend
```bash
cd frontend
npm run dev
```
Open the URL it prints (usually http://localhost:5173). Connect your wallet (use a local wallet/anvil key or Metamask on Hardhat network).

### 4) Wire up real protocols (optional)
- Fill Aave/Compound addresses in `contracts/adapters/` and flip `activeProvider` in `SavingsVault.sol` to route deposits.
- Update `src/lib/protocols.ts` with addresses and (optionally) onchain read helpers for live APYs.

### 5) Push to GitHub
```bash
# from the project root
git init
git add .
git commit -m "feat: stablecoin-savings-app starter"
git branch -M main
git remote add origin https://github.com/<your-username>/stablecoin-savings-app.git
git push -u origin main
```

## Notes

- This starter **compiles now** and demonstrates flows locally. To make production-ready:
  - Use Aave v3 or Compound v3 (Comet) adapters in `contracts/adapters/`.
  - Add chain selectors + price feeds for accurate APY.
  - Replace simulated chart data with subgraph metrics.
  - Add audits and formal verification for vault logic.
