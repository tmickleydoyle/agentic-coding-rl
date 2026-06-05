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

describe('Subscriber MRR Tracker', () => {
  it('starts on the Subscribers view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('shows seed subscribers on load', () => {
    render(<App />)
    expect(screen.getByText('Alice Chen')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    expect(screen.getByText('Carol White')).toBeInTheDocument()
  })

  it('shows correct active count for seed data', () => {
    render(<App />)
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('dashboard shows correct seed MRR (Alice Pro $29 + Bob Basic $9 = $38)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $38')).toBeInTheDocument()
  })

  it('dashboard shows seed total and active subscriber counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
  })

  it('dashboard shows per-plan counts for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Basic subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Pro subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 1')).toBeInTheDocument()
  })

  it('adds a new subscriber and updates the active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Dan Lee', 'Basic')
    expect(screen.getByText('Active: 3 of 4')).toBeInTheDocument()
    expect(screen.getByText('Dan Lee')).toBeInTheDocument()
  })

  it('ignores a blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('deactivating a subscriber updates the active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate alice chen/i }))
    expect(screen.getByText('Active: 1 of 3')).toBeInTheDocument()
  })

  it('deactivating a subscriber changes button to Activate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate alice chen/i }))
    expect(screen.getByRole('button', { name: /activate alice chen/i })).toBeInTheDocument()
  })

  it('activating an inactive subscriber updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /activate carol white/i }))
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('toggling active status cross-view updates dashboard MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Deactivate Alice (Pro $29) => MRR drops from $38 to $9
    await u.click(screen.getByRole('button', { name: /deactivate alice chen/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $9')).toBeInTheDocument()
  })

  it('adding a Pro subscriber updates dashboard MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Eve Kim', 'Pro')
    await nav(u, 'Dashboard')
    // Seed active: Alice Pro $29 + Bob Basic $9 = $38; Eve Pro $29 => $67
    expect(screen.getByText('Monthly Recurring Revenue: $67')).toBeInTheDocument()
  })

  it('adding an Enterprise subscriber updates plan count on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Frank Oz', 'Enterprise')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Enterprise subscribers: 2')).toBeInTheDocument()
  })

  it('hide inactive hides inactive subscribers on Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByText('Carol White')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Subscribers')
    expect(screen.queryByText('Carol White')).not.toBeInTheDocument()
  })

  it('hide inactive still counts inactive in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Subscribers')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('subscriber list state persists across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Grace Ho', 'Pro')
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Grace Ho')).toBeInTheDocument()
  })
})
