import { describe, it, expect, vi } from 'vitest'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import type { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { Provider } from './Provider'

// WagmiProvider needs a live wagmi Config; stub it to a passthrough so we can
// assert that Provider wires children through without a real wallet connection.
vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

const fakeAdapter = { wagmiConfig: {} } as unknown as WagmiAdapter

describe('<Provider>', () => {
  it('renders children through the wagmi + query providers', () => {
    render(
      <Provider wagmiAdapter={fakeAdapter}>
        <span>hello widget</span>
      </Provider>,
    )
    expect(screen.getByText('hello widget')).toBeInTheDocument()
  })

  it('accepts a custom queryClient', () => {
    const queryClient = new QueryClient()
    render(
      <Provider wagmiAdapter={fakeAdapter} queryClient={queryClient}>
        <span>custom client</span>
      </Provider>,
    )
    expect(screen.getByText('custom client')).toBeInTheDocument()
  })
})
