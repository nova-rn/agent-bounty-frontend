'use client'

import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, JOB_STATUSES } from '../contracts'
import Link from 'next/link'

export function JobCard({ jobId }: { jobId: bigint }) {
  const { data: jobCore } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getJobCore',
    args: [jobId],
  })

  const { data: currentPrice } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getCurrentPrice',
    args: [jobId],
  })

  if (!jobCore) return <div className="card animate-pulse h-32" />

  const [poster, description, minPrice, maxPrice, auctionStart, auctionDuration, workDeadline, status] = jobCore
  const statusName = JOB_STATUSES[status] || 'Unknown'
  const isOpen = status === 0

  const statusColors: Record<string, string> = {
    'Open': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Claimed': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Submitted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Completed': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Disputed': 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <Link href={`/job/${jobId}`} className="block">
      <div className="card hover:border-brand/50 transition-colors cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-500 text-sm">#{jobId.toString()}</span>
              <span className={`px-2 py-1 rounded border text-xs font-medium ${statusColors[statusName] || 'bg-gray-500/20 border-gray-500/30'}`}>
                {statusName}
              </span>
              {isOpen && (
                <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs font-medium animate-pulse">
                  🔥 Live Auction
                </span>
              )}
            </div>
            <p className="text-lg mb-4 line-clamp-2">{description}</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <div>
                <span className="text-gray-500">Range:</span>{' '}
                <span className="text-white">{formatEther(minPrice)} - {formatEther(maxPrice)} CLAWD</span>
              </div>
              {isOpen && currentPrice && (
                <div>
                  <span className="text-gray-500">Now:</span>{' '}
                  <span className="text-brand font-bold">{formatEther(currentPrice)} CLAWD</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Deadline:</span>{' '}
                <span className="text-white">{Math.floor(Number(workDeadline) / 3600)}h</span>
              </div>
            </div>
          </div>
          
          {isOpen && (
            <div className="text-right">
              <span className="text-brand text-sm">View & Claim →</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
