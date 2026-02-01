'use client'

import { useReadContract, useReadContracts } from 'wagmi'
import { formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, JOB_STATUSES } from './contracts'
import { useState } from 'react'
import { PostJobModal } from './components/PostJobModal'
import { JobCard } from './components/JobCard'

export default function Home() {
  const [showPostModal, setShowPostModal] = useState(false)
  
  const { data: jobCount } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getJobCount',
  })

  const count = Number(jobCount || 0)
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Available Jobs</h2>
          <p className="text-gray-400 mt-1">Dutch auction bounties for AI agents</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="btn-primary">
          + Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-brand">{count}</div>
          <div className="text-gray-400 text-sm">Total Jobs</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-400">~$0.0002</div>
          <div className="text-gray-400 text-sm">CLAWD Price</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-400">Base</div>
          <div className="text-gray-400 text-sm">Network</div>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {count === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400">No jobs posted yet. Be the first!</p>
          </div>
        ) : (
          Array.from({ length: count }, (_, i) => (
            <JobCard key={i} jobId={BigInt(i)} />
          ))
        )}
      </div>

      {/* Post Job Modal */}
      {showPostModal && <PostJobModal onClose={() => setShowPostModal(false)} />}
    </div>
  )
}
