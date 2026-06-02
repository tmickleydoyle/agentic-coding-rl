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

describe('Subscriber MRR Tracker', () => {
  it('starts on the Subscribers view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /subscribers/i })).toBeInTheDocument()
  })

  it('seeds three subscribers on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Subscribers (3)' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct plan labels and prices for seed data', () => {
    render(<App />)
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('$79')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
    expect(screen.getByText('$199')).toBeInTheDocument()
  })

  it('navigates to Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Subscribers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: /subscribers/i })).toBeInTheDocument()
  })

  it('adds a new subscriber and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Dave', 'Pro ($79/mo)')
    expect(screen.getByRole('heading', { name: 'Subscribers (4)' })).toBeInTheDocument()
    expect(screen.getByText('Dave')).toBeInTheDocument()
  })

  it('ignores blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByRole('heading', { name: 'Subscribers (3)' })).toBeInTheDocument()
  })

  it('removes a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    expect(screen.getByRole('heading', { name: 'Subscribers (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('toggles a subscriber active state', async () => {
    const u = userEvent.setup()
    render(<App />)
    const checkbox = screen.getByLabelText('Active: Alice')
    expect(checkbox).toBeChecked()
    await u.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('dashboard shows correct totals for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $307')).toBeInTheDocument()
  })

  it('dashboard MRR excludes inactive subscribers (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Carol'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $108')).toBeInTheDocument()
  })

  it('dashboard total subscribers includes inactive (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Alice'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
  })

  it('average MRR per active subscriber is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // 307 / 3 = 102 (rounded)
    expect(screen.getByText('Average MRR per active subscriber: $102')).toBeInTheDocument()
  })

  it('average MRR is $0 when no active subscribers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active: Alice'))
    await u.click(screen.getByLabelText('Active: Bob'))
    await u.click(screen.getByLabelText('Active: Carol'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $0')).toBeInTheDocument()
    expect(screen.getByText('Average MRR per active subscriber: $0')).toBeInTheDocument()
  })

  it('dashboard updates after adding a new active subscriber (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Eve', 'Starter ($29/mo)')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 4')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 4')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $336')).toBeInTheDocument()
  })

  it('dashboard updates after removing a subscriber (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Carol' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $108')).toBeInTheDocument()
  })

  it('theme toggles between light and dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('subscriber list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Frank', 'Enterprise ($199/mo)')
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Subscribers (4)' })).toBeInTheDocument()
  })

  it('plan select has all three options', () => {
    render(<App />)
    const select = screen.getByLabelText('Plan')
    expect(within(select as HTMLElement).getByRole('option', { name: 'Starter ($29/mo)' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Pro ($79/mo)' })).toBeInTheDocument()
    expect(within(select as HTMLElement).getByRole('option', { name: 'Enterprise ($199/mo)' })).toBeInTheDocument()
  })
})
