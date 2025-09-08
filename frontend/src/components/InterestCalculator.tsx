import { useEffect, useState } from 'react'
import { getMockAPY, type Protocol } from '../lib/protocols'

export default function InterestCalculator() {
  const [protocol, setProtocol] = useState<Protocol>('Aave')
  const [symbol, setSymbol] = useState<'USDC' | 'DAI'>('USDC')
  const [principal, setPrincipal] = useState(1000)
  const [apr, setApr] = useState(0.04)

  useEffect(() => {
    getMockAPY(protocol, symbol).then(r => setApr(r))
  }, [protocol, symbol])

  const years = 1
  const apy = (1 + apr / 365) ** (365 * years) - 1
  const earned = principal * apy

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>Interest Calculator</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>Protocol</label>
        <select value={protocol} onChange={e => setProtocol(e.target.value as Protocol)}>
          <option value="Aave">Aave</option>
          <option value="Compound">Compound</option>
        </select>

        <label>Asset</label>
        <select value={symbol} onChange={e => setSymbol(e.target.value as 'USDC' | 'DAI')}>
          <option value="USDC">USDC</option>
          <option value="DAI">DAI</option>
        </select>

        <label>Deposit Amount (USD)</label>
        <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} />

        <div>Estimated APR: {(apr * 100).toFixed(2)}%</div>
        <div>Projected APY (1y): {(apy * 100).toFixed(2)}%</div>
        <div>Projected Earnings (1y): ${earned.toFixed(2)}</div>
      </div>
    </div>
  )
}
