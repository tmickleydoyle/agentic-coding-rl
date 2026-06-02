// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSubscriber(u: U, name: string, plan?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (plan) {
    await u.selectOptions(screen.getByLabelText('Plan'), plan)
  }
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('re-activating a subscriber updates dashboard MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Bob'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $228')).toBeInTheDocument()
    await nav(u, 'Subscribers')
    await u.click(screen.getByLabelText('Active: Bob'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $307')).toBeInTheDocument()
  })

  it('adding two enterprise subscribers and checking MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Gina', 'Enterprise ($199/mo)')
    await addSubscriber(u, 'Hank', 'Enterprise ($199/mo)')
    await nav(u, 'Dashboard')
    // seed 307 + 199 + 199 = 705
    expect(screen.getByText('Monthly Recurring Revenue: $705')).toBeInTheDocument()
    expect(screen.getByText('Total subscribers: 5')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 5')).toBeInTheDocument()
  })

  it('removing all subscribers yields zero totals on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Alice' }))
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    await u.click(screen.getByRole('button', { name: 'Remove Carol' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $0')).toBeInTheDocument()
    expect(screen.getByText('Average MRR per active subscriber: $0')).toBeInTheDocument()
  })

  it('single active starter subscriber gives correct average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Alice'))
    await u.click(screen.getByLabelText('Active: Carol'))
    await nav(u, 'Dashboard')
    // only Bob active at $79
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $79')).toBeInTheDocument()
    expect(screen.getByText('Average MRR per active subscriber: $79')).toBeInTheDocument()
  })

  it('settings theme button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: 'Toggle theme (current: light)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: 'Toggle theme (current: dark)' })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('subscriber count heading updates on remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Alice' }))
    expect(screen.getByRole('heading', { name: 'Subscribers (2)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    expect(screen.getByRole('heading', { name: 'Subscribers (1)' })).toBeInTheDocument()
  })

  it('inactive subscribers still counted in total but not MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Alice'))
    await u.click(screen.getByLabelText('Active: Bob'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $199')).toBeInTheDocument()
  })

  it('new subscriber added as pro plan is active and affects MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Ivan', 'Pro ($79/mo)')
    await nav(u, 'Dashboard')
    // 307 + 79 = 386
    expect(screen.getByText('Monthly Recurring Revenue: $386')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 4')).toBeInTheDocument()
  })
})
