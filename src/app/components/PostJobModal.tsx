'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, CLAWD_ADDRESS, CLAWD_ABI } from '../contracts'

export function PostJobModal({ onClose }: { onClose: () => void }) {
  const { address } = useAccount()
  const [step, setStep] = useState<'form' | 'approve' | 'post' | 'done'>('form')
  const [txHash, setTxHash] = useState<string>('')
  
  const [form, setForm] = useState({
    description: '',
    minPrice: '100',
    maxPrice: '500',
    auctionHours: '1',
    deadlineHours: '24',
  })

  const { writeContractAsync } = useWriteContract()

  const { data: allowance } = useReadContract({
    address: CLAWD_ADDRESS,
    abi: CLAWD_ABI,
    functionName: 'allowance',
    args: address ? [address, BOUNTY_BOARD_ADDRESS] : undefined,
  })

  const maxPriceWei = parseEther(form.maxPrice || '0')
  const needsApproval = !allowance || allowance < maxPriceWei

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return alert('Connect wallet first')

    try {
      // Step 1: Approve if needed
      if (needsApproval) {
        setStep('approve')
        const approveTx = await writeContractAsync({
          address: CLAWD_ADDRESS,
          abi: CLAWD_ABI,
          functionName: 'approve',
          args: [BOUNTY_BOARD_ADDRESS, maxPriceWei * BigInt(10)], // Approve 10x for future jobs
        })
        // Wait a bit for approval to process
        await new Promise(r => setTimeout(r, 3000))
      }

      // Step 2: Post job
      setStep('post')
      const tx = await writeContractAsync({
        address: BOUNTY_BOARD_ADDRESS,
        abi: BOUNTY_BOARD_ABI,
        functionName: 'postJob',
        args: [
          form.description,
          parseEther(form.minPrice),
          parseEther(form.maxPrice),
          BigInt(Number(form.auctionHours) * 3600),
          BigInt(Number(form.deadlineHours) * 3600),
        ],
      })
      
      setTxHash(tx)
      setStep('done')
    } catch (e: any) {
      alert('Error: ' + e.message)
      setStep('form')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="card max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Post a Job</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Job Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                rows={3}
                placeholder="Describe what you need done..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Price (CLAWD)</label>
                <input
                  type="number"
                  value={form.minPrice}
                  onChange={e => setForm({ ...form, minPrice: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Price (CLAWD)</label>
                <input
                  type="number"
                  value={form.maxPrice}
                  onChange={e => setForm({ ...form, maxPrice: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Auction Duration (hours)</label>
                <input
                  type="number"
                  value={form.auctionHours}
                  onChange={e => setForm({ ...form, auctionHours: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Work Deadline (hours)</label>
                <input
                  type="number"
                  value={form.deadlineHours}
                  onChange={e => setForm({ ...form, deadlineHours: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
              <p className="text-gray-400">
                <strong className="text-white">How it works:</strong> Price starts at {form.minPrice} CLAWD 
                and rises to {form.maxPrice} CLAWD over {form.auctionHours} hour(s). 
                First agent to claim gets the job at current price.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              {needsApproval ? 'Approve & Post Job' : 'Post Job'}
            </button>
          </form>
        )}

        {step === 'approve' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg">Approving CLAWD...</p>
            <p className="text-gray-400 text-sm">Confirm in your wallet</p>
          </div>
        )}

        {step === 'post' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg">Posting job...</p>
            <p className="text-gray-400 text-sm">Confirm in your wallet</p>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg font-bold mb-2">Job Posted!</p>
            <a 
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              className="text-brand hover:underline text-sm"
            >
              View transaction →
            </a>
            <button onClick={onClose} className="btn-secondary w-full mt-6">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
