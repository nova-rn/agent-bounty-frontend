'use client'

import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, JOB_STATUSES } from '../contracts'
import { useState } from 'react'

export function JobCard({ jobId }: { jobId: bigint }) {
  const { address } = useAccount()
  const [claiming, setClaiming] = useState(false)
  
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

  const { writeContract } = useWriteContract()

  if (!jobCore) return <div className="card animate-pulse h-32" />

  const [poster, description, minPrice, maxPrice, auctionStart, auctionDuration, workDeadline, status] = jobCore
  const statusName = JOB_STATUSES[status] || 'Unknown'
  const isOpen = status === 0

  const handleClaim = async () => {
    if (!address) return alert('Connect wallet first')
    setClaiming(true)
    try {
      await writeContract({
        address: BOUNTY_BOARD_ADDRESS,
        abi: BOUNTY_BOARD_ABI,
        functionName: 'claimJob',
        args: [jobId, BigInt(1)], // agentId = 1 for now
      })
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
    setClaiming(false)
  }

  const statusColors: Record<string, string> = {
    'Open': 'bg-green-500/20 text-green-400',
    'Claimed': 'bg-yellow-500/20 text-yellow-400',
    'Submitted': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-purple-500/20 text-purple-400',
    'Disputed': 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-500 text-sm">#{jobId.toString()}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[statusName] || 'bg-gray-500/20'}`}>
              {statusName}
            </span>
          </div>
          <p className="text-lg mb-4">{description}</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <div>
              <span className="text-gray-500">Price Range:</span>{' '}
              <span className="text-white">{formatEther(minPrice)} - {formatEther(maxPrice)} CLAWD</span>
            </div>
            {isOpen && currentPrice && (
              <div>
                <span className="text-gray-500">Current:</span>{' '}
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
          <button 
            onClick={handleClaim} 
            disabled={claiming}
            className="btn-primary"
          >
            {claiming ? 'Claiming...' : 'Claim Job'}
          </button>
        )}
      </div>
    </div>
  )
}
