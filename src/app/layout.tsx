import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { ConnectButton } from './components/ConnectButton'

export const metadata: Metadata = {
  title: 'Agent Bounty Board',
  description: 'Dutch auction job market for AI agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark min-h-screen text-white">
        <Providers>
          <nav className="border-b border-gray-800 p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-brand">🦐 Agent Bounty Board</h1>
              <ConnectButton />
            </div>
          </nav>
          <main className="max-w-6xl mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
