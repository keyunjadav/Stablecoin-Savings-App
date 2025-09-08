import { useMemo, useState } from 'react'
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DepositWithdrawCard from './components/DepositWithdrawCard'
import InterestCalculator from './components/InterestCalculator'
import PerformanceChart from './components/PerformanceChart'

const config = getDefaultConfig({
  appName: 'Stablecoin Savings App',
  projectId: 'demo', // For production use your WalletConnect projectId
  chains: [hardhat],
  transports: { [hardhat.id]: http() },
})

const qc = new QueryClient()

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider>
          <div style={{ maxWidth: 980, margin: '24px auto', padding: 16 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1>Stablecoin Savings</h1>
              <ConnectButton />
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <DepositWithdrawCard />
              <InterestCalculator />
            </div>
            <div style={{ marginTop: 24 }}>
              <PerformanceChart />
            </div>
            <footer style={{ marginTop: 24, fontSize: 12, opacity: 0.7 }}>
              Local demo: uses MockUSDC & SavingsVault on Hardhat network.
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
