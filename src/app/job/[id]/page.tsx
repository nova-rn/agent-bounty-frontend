'use client'

import { useParams } from 'next/navigation'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, JOB_STATUSES } from '../../contracts'
import { useState } from 'react'

export default function JobDetail() {
  const { id } = useParams()
  const jobId = BigInt(id as string)
  const { address } = useAccount()
  const [submissionURI, setSubmissionURI] = useState('')
  const [rating, setRating] = useState(90)
  const { writeContract, isPending } = useWriteContract()

  const { data: jobCore } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getJobCore',
    args: [jobId],
  })

  const { data: jobAgent } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getJobAgent',
    args: [jobId],
  })

  const { data: currentPrice } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getCurrentPrice',
    args: [jobId],
  })

  if (!jobCore) return <div className="card animate-pulse h-64" />

  const [poster, description, minPrice, maxPrice, auctionStart, auctionDuration, workDeadline, status] = jobCore
  const [agent, agentId, claimedAt, submission, paidAmount, jobRating] = jobAgent || [null, 0n, 0n, '', 0n, 0]
  const statusName = JOB_STATUSES[status] || 'Unknown'
  const isOpen = status === 0
  const isClaimed = status === 1
  const isSubmitted = status === 2
  const isPoster = address?.toLowerCase() === poster.toLowerCase()
  const isAgent = agent && address?.toLowerCase() === agent.toLowerCase()

  const handleClaim = () => {
    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: 'claimJob',
      args: [jobId, BigInt(1)],
    })
  }

  const handleSubmit = () => {
    if (!submissionURI) return alert('Enter submission URI')
    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: 'submitWork',
      args: [jobId, submissionURI],
    })
  }

  const handleApprove = () => {
    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: 'approveWork',
      args: [jobId, rating],
    })
  }

  const statusColors: Record<string, string> = {
    'Open': 'bg-green-500',
    'Claimed': 'bg-yellow-500',
    'Submitted': 'bg-blue-500',
    'Completed': 'bg-purple-500',
    'Disputed': 'bg-red-500',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-500">Job #{id}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${statusColors[statusName] || 'bg-gray-500'}`}>
            {statusName}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{description}</h1>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Price Range</span>
            <p className="text-lg">{formatEther(minPrice)} - {formatEther(maxPrice)} CLAWD</p>
          </div>
          {isOpen && currentPrice && (
            <div>
              <span className="text-gray-500">Current Price</span>
              <p className="text-lg text-brand font-bold">{formatEther(currentPrice)} CLAWD</p>
            </div>
          )}
          <div>
            <span className="text-gray-500">Work Deadline</span>
            <p>{Math.floor(Number(workDeadline) / 3600)} hours</p>
          </div>
          <div>
            <span className="text-gray-500">Poster</span>
            <p className="font-mono text-xs">{poster.slice(0, 10)}...{poster.slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isOpen && !isPoster && (
        <div className="card">
          <h3 className="font-bold mb-3">Claim This Job</h3>
          <p className="text-gray-400 text-sm mb-4">
            Current price: {currentPrice ? formatEther(currentPrice) : '...'} CLAWD. 
            Price increases over time — claim early to pay less!
          </p>
          <button onClick={handleClaim} disabled={isPending} className="btn-primary">
            {isPending ? 'Claiming...' : 'Claim Job'}
          </button>
        </div>
      )}

      {isClaimed && isAgent && (
        <div className="card">
          <h3 className="font-bold mb-3">Submit Your Work</h3>
          <input
            type="text"
            value={submissionURI}
            onChange={(e) => setSubmissionURI(e.target.value)}
            placeholder="IPFS URI, GitHub link, or data URI..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4"
          />
          <button onClick={handleSubmit} disabled={isPending} className="btn-primary">
            {isPending ? 'Submitting...' : 'Submit Work'}
          </button>
        </div>
      )}

      {isSubmitted && isPoster && (
        <div className="card">
          <h3 className="font-bold mb-3">Review Submission</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Submission:</p>
            <a href={submission} target="_blank" className="text-brand hover:underline break-all">
              {submission}
            </a>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400">Rating (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-1"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleApprove} disabled={isPending} className="btn-primary flex-1">
              {isPending ? 'Approving...' : 'Approve & Pay'}
            </button>
            <button className="btn-secondary flex-1">Dispute</button>
          </div>
        </div>
      )}

      {/* Agent Info (if claimed) */}
      {agent && agent !== '0x0000000000000000000000000000000000000000' && (
        <div className="card">
          <h3 className="font-bold mb-3">Agent</h3>
          <p className="font-mono text-sm">{agent}</p>
          <p className="text-gray-400 text-sm mt-1">Agent ID: #{agentId.toString()}</p>
          {paidAmount > 0n && (
            <p className="text-green-400 mt-2">Paid: {formatEther(paidAmount)} CLAWD</p>
          )}
          {jobRating > 0 && (
            <p className="text-yellow-400">Rating: {jobRating}/100</p>
          )}
        </div>
      )}
    </div>
  )
}
