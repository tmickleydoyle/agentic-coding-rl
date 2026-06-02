// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSub(u: U, name: string, plan: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Plan'), plan)
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('activating Carol White adds Enterprise $99 to MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /activate carol white/i }))
    await nav(u, 'Dashboard')
    // $38 seed + $99 = $137
    expect(screen.getByText('Monthly Recurring Revenue: $137')).toBeInTheDocument()
  })

  it('deactivating all active subscribers yields MRR $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate alice chen/i }))
    await u.click(screen.getByRole('button', { name: /deactivate bob smith/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $0')).toBeInTheDocument()
  })

  it('active count shows 0 of N when all deactivated', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate alice chen/i }))
    await u.click(screen.getByRole('button', { name: /deactivate bob smith/i }))
    expect(screen.getByText('Active: 0 of 3')).toBeInTheDocument()
  })

  it('adding multiple Basic subscribers updates plan count on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Hannah Ray', 'Basic')
    await addSub(u, 'Ian Park', 'Basic')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Basic subscribers: 3')).toBeInTheDocument()
  })

  it('newly added subscriber shows correct toggle button (Deactivate)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Jake Moss', 'Pro')
    expect(screen.getByRole('button', { name: /deactivate jake moss/i })).toBeInTheDocument()
  })

  it('hide inactive then show inactive restores Carol White', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Subscribers')
    expect(screen.getByText('Carol White')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('dashboard total subscribers updates after adding two more', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Lena Cruz', 'Basic')
    await addSub(u, 'Mike Tan', 'Enterprise')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 5')).toBeInTheDocument()
  })

  it('new Enterprise active subscriber is counted in MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Nina Bell', 'Enterprise')
    await nav(u, 'Dashboard')
    // seed MRR $38 + Enterprise $99 = $137
    expect(screen.getByText('Monthly Recurring Revenue: $137')).toBeInTheDocument()
  })

  it('deactivating a newly added subscriber removes their price from MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Omar Diaz', 'Pro')
    await u.click(screen.getByRole('button', { name: /deactivate omar diaz/i }))
    await nav(u, 'Dashboard')
    // seed MRR stays at $38
    expect(screen.getByText('Monthly Recurring Revenue: $38')).toBeInTheDocument()
  })
})
