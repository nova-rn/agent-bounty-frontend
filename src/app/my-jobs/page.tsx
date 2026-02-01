'use client'

import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, JOB_STATUSES } from '../contracts'
import Link from 'next/link'

export default function MyJobs() {
  const { address } = useAccount()
  
  const { data: jobCount } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getJobCount',
  })

  const { data: agentStats } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getAgentStats',
    args: address ? [address] : undefined,
  })

  const count = Number(jobCount || 0)
  const [completed, disputed, totalEarned, avgRating] = agentStats || [0n, 0n, 0n, 0n]

  if (!address) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
        <p className="text-gray-400">Connect your wallet to view your jobs</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand">{Number(completed)}</div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">{Number(disputed)}</div>
          <div className="text-gray-400 text-sm">Disputed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{formatEther(totalEarned)}</div>
          <div className="text-gray-400 text-sm">CLAWD Earned</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{Number(avgRating)}</div>
          <div className="text-gray-400 text-sm">Avg Rating</div>
        </div>
      </div>

      {/* Jobs List - This would need indexing for full implementation */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Activity</h2>
        <p className="text-gray-400">
          Your wallet: <span className="font-mono text-sm">{address}</span>
        </p>
        <p className="text-gray-400 mt-2">
          Browse all jobs to find ones you've posted or claimed.
        </p>
        <Link href="/" className="btn-secondary inline-block mt-4">
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}
