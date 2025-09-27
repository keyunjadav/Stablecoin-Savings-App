import { useEffect, useMemo, useState } from 'react'
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi'
import { parseUnits } from 'viem'
import vaultAbi from '../lib/abi/SavingsVault.json'
import erc20Abi from '../lib/abi/ERC20.json'

const VAULT = import.meta.env.VITE_VAULT_ADDRESS as `0x${string}`
const STABLE = import.meta.env.VITE_STABLECOIN_ADDRESS as `0x${string}`

export default function DepositWithdrawCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState('100')

  const { data: allowance } = useReadContract({
    address: STABLE,
    abi: erc20Abi as any,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', VAULT],
    query: { enabled: isConnected },
  })

  const { data: previewShares } = useReadContract({
    address: VAULT,
    abi: vaultAbi as any,
    functionName: 'previewDeposit',
    args: [amount ? parseUnits(amount, 6) : 0n],
    query: { enabled: Boolean(amount) },
  })

  const { writeContractAsync: approve } = useWriteContract()
  const { writeContractAsync: deposit } = useWriteContract()
  const { writeContractAsync: withdraw } = useWriteContract()

  const needApprove = useMemo(() => {
    if (!amount || allowance == null) return true
    try {
      return allowance < parseUnits(amount, 6)
    } catch { return true }
  }, [allowance, amount])

  const onApprove = async () => {
    await approve({
      address: STABLE,
      abi: erc20Abi as any,
      functionName: 'approve',
      args: [VAULT, parseUnits(amount || '0', 6)]
    })
  }

  const onDeposit = async () => {
    await deposit({
      address: VAULT,
      abi: vaultAbi as any,
      functionName: 'deposit',
      args: [parseUnits(amount || '0', 6), address!]
    })
  }

  const onWithdrawMax = async () => {
    // read user shares then withdraw all
    await withdraw({
      address: VAULT,
      abi: vaultAbi as any,
      functionName: 'withdraw',
      args: [await getUserShares(), address!]
    })
  }

  async function getUserShares(): Promise<bigint> {
    const res = await (window as any).ethereum?.request?.({ method: 'eth_call' })
    // quick read via wagmi:
    const r = await (window as any).wagmiConfig.getClient({ chainId }).readContract({
      address: VAULT,
      abi: vaultAbi as any,
      functionName: 'balanceOf',
      args: [address!]
    })
    return r as bigint
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>Deposit / Withdraw</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>Amount (USDC)</label>
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="100"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <div style={{ fontSize: 12, opacity: 0.7 }}>Preview shares: {previewShares ? previewShares.toString() : '-'}</div>
        {!isConnected ? (
          <div>Connect wallet to continue.</div>
        ) : needApprove ? (
          <button onClick={onApprove} style={{ padding: 10, borderRadius: 8 }}>Approve</button>
        ) : (
          <button onClick={onDeposit} style={{ padding: 10, borderRadius: 8 }}>Deposit</button>
        )}
        <button onClick={onWithdrawMax} style={{ padding: 10, borderRadius: 8 }}>Withdraw All</button>
      </div>
    </div>
  )
}
