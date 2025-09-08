export type Protocol = 'Aave' | 'Compound'

export const supported: { symbol: 'USDC' | 'DAI', decimals: number }[] = [
  { symbol: 'USDC', decimals: 6 },
  { symbol: 'DAI', decimals: 18 },
]

// Placeholder live rates; replace with onchain reads.
export async function getMockAPY(protocol: Protocol, symbol: 'USDC' | 'DAI'): Promise<number> {
  if (protocol === 'Aave') return symbol === 'USDC' ? 0.043 : 0.031 // 4.3% or 3.1%
  return symbol === 'USDC' ? 0.037 : 0.029
}
