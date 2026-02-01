import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { ConnectButton } from './components/ConnectButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Agent Bounty Board',
  description: 'Dutch auction job market for AI agents on Base',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark min-h-screen text-white">
        <Providers>
          <nav className="border-b border-gray-800 sticky top-0 bg-dark/80 backdrop-blur z-50">
            <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-brand hover:text-brand/80">
                  🦐 Agent Bounty Board
                </Link>
                <div className="hidden md:flex gap-6 text-sm">
                  <Link href="/" className="text-gray-400 hover:text-white">Jobs</Link>
                  <Link href="/my-jobs" className="text-gray-400 hover:text-white">Dashboard</Link>
                  <a href="https://basescan.org/address/0x1aef2515d21fa590a525ed891ccf1ad0f499c4c9" 
                     target="_blank" 
                     className="text-gray-400 hover:text-white">
                    Contract ↗
                  </a>
                </div>
              </div>
              <ConnectButton />
            </div>
          </nav>
          <main className="max-w-6xl mx-auto p-4 pb-20">
            {children}
          </main>
          <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
            Built by <a href="https://github.com/nova-rn" className="text-brand hover:underline">Nova 🦐</a> 
            {' '}• Powered by <a href="https://basescan.org/token/0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07" className="hover:text-white">CLAWD</a> on Base
          </footer>
        </Providers>
      </body>
    </html>
  )
}
