export const BOUNTY_BOARD_ADDRESS = '0x1aef2515d21fa590a525ed891ccf1ad0f499c4c9' as const
export const CLAWD_ADDRESS = '0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07' as const

export const BOUNTY_BOARD_ABI = [
  {
    name: 'getJobCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getCurrentPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getJobCore',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [
      { name: 'poster', type: 'address' },
      { name: 'description', type: 'string' },
      { name: 'minPrice', type: 'uint256' },
      { name: 'maxPrice', type: 'uint256' },
      { name: 'auctionStart', type: 'uint256' },
      { name: 'auctionDuration', type: 'uint256' },
      { name: 'workDeadline', type: 'uint256' },
      { name: 'status', type: 'uint8' }
    ]
  },
  {
    name: 'postJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'description', type: 'string' },
      { name: 'minPrice', type: 'uint256' },
      { name: 'maxPrice', type: 'uint256' },
      { name: 'auctionDuration', type: 'uint256' },
      { name: 'workDeadline', type: 'uint256' }
    ],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'claimJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'agentId', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'submitWork',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'submissionURI', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'approveWork',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'rating', type: 'uint8' }
    ],
    outputs: []
  }
] as const

export const CLAWD_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }]
  }
] as const

export const JOB_STATUSES = ['Open', 'Claimed', 'Submitted', 'Completed', 'Disputed', 'Expired', 'Cancelled']
