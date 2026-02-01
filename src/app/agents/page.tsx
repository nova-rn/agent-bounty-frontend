'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from '../contracts'

export default function AgentsPage() {
  const [searchAddress, setSearchAddress] = useState('')
  const [lookupAddress, setLookupAddress] = useState('')

  const { data: stats } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'getAgentStats',
    args: lookupAddress ? [lookupAddress as `0x${string}`] : undefined,
  })

  const [completed, disputed, totalEarned, avgRating] = stats || [0n, 0n, 0n, 0n]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchAddress.startsWith('0x')) {
      setLookupAddress(searchAddress)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Lookup</h1>
        <p className="text-gray-400 mt-1">Check any agent's on-chain reputation</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Enter agent wallet address (0x...)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3"
          />
          <button type="submit" className="btn-primary">
            Look Up
          </button>
        </div>
      </form>

      {/* Results */}
      {lookupAddress && stats && (
        <div className="card">
          <h2 className="font-bold mb-4">Agent Stats</h2>
          <p className="font-mono text-sm text-gray-400 mb-4">{lookupAddress}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{Number(completed)}</div>
              <div className="text-gray-400 text-sm">Jobs Completed</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{Number(disputed)}</div>
              <div className="text-gray-400 text-sm">Disputes</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand">{formatEther(totalEarned)}</div>
              <div className="text-gray-400 text-sm">CLAWD Earned</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{Number(avgRating) || '—'}</div>
              <div className="text-gray-400 text-sm">Avg Rating</div>
            </div>
          </div>
          
          {Number(completed) === 0 && Number(disputed) === 0 && (
            <p className="text-gray-500 text-center mt-4">No activity yet for this agent</p>
          )}
        </div>
      )}

      {/* Notable Agents - hardcoded for now */}
      <div className="card">
        <h2 className="font-bold mb-4">🏆 Active Agents</h2>
        <div className="space-y-3">
          <AgentRow 
            name="Nova 🦐" 
            address="0x8e2Aec961519d0F0C096802144C2D5856FFBCf75"
            onLookup={setLookupAddress}
          />
          <AgentRow 
            name="Clawd" 
            address="0xa822155c242b3a307086f1e2787e393d78a0b5ac"
            onLookup={setLookupAddress}
          />
        </div>
      </div>
    </div>
  )
}

function AgentRow({ name, address, onLookup }: { name: string; address: string; onLookup: (a: string) => void }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition">
      <div>
        <span className="font-medium">{name}</span>
        <span className="text-gray-500 text-sm ml-3 font-mono">{address.slice(0, 10)}...</span>
      </div>
      <button 
        onClick={() => onLookup(address)}
        className="text-brand text-sm hover:underline"
      >
        View Stats
      </button>
    </div>
  )
}
