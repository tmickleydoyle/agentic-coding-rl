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

function subRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Subscriber MRR Tracker', () => {
  it('starts on the Subscribers view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('shows active count on initial load', () => {
    render(<App />)
    expect(screen.getByText('Active: 0 of 0')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('adds a subscriber with Starter plan', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Alice', 'Starter ($29/mo)')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Active: 1 of 1')).toBeInTheDocument()
  })

  it('ignores a blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByText('Active: 0 of 0')).toBeInTheDocument()
  })

  it('new subscriber is active by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Bob')
    const checkbox = within(subRow('Bob')).getByLabelText(/active bob/i)
    expect(checkbox).toBeChecked()
  })

  it('toggles a subscriber inactive and updates active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Carol')
    expect(screen.getByText('Active: 1 of 1')).toBeInTheDocument()
    await u.click(within(subRow('Carol')).getByLabelText(/active carol/i))
    expect(screen.getByText('Active: 0 of 1')).toBeInTheDocument()
  })

  it('removes a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Dave')
    await u.click(within(subRow('Dave')).getByRole('button', { name: /remove dave/i }))
    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
    expect(screen.getByText('Active: 0 of 0')).toBeInTheDocument()
  })

  it('dashboard shows zeros when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Active Subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive Subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $0')).toBeInTheDocument()
    expect(screen.getByText('Average Revenue per User (ARPU): $0')).toBeInTheDocument()
  })

  it('dashboard MRR counts only active subscribers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Eve', 'Pro ($79/mo)')
    await addSubscriber(u, 'Frank', 'Starter ($29/mo)')
    // deactivate Frank
    await u.click(within(subRow('Frank')).getByLabelText(/active frank/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $79')).toBeInTheDocument()
  })

  it('dashboard ARPU is MRR divided by active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Grace', 'Starter ($29/mo)')
    await addSubscriber(u, 'Hank', 'Pro ($79/mo)')
    await nav(u, 'Dashboard')
    // MRR = 29+79 = 108, active = 2, ARPU = 54
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $108')).toBeInTheDocument()
    expect(screen.getByText('Average Revenue per User (ARPU): $54')).toBeInTheDocument()
  })

  it('dashboard ARPU is $0 when no active subscribers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Ivan', 'Enterprise ($199/mo)')
    await u.click(within(subRow('Ivan')).getByLabelText(/active ivan/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average Revenue per User (ARPU): $0')).toBeInTheDocument()
  })

  it('dashboard reflects cross-view state (toggle active on subscribers view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Judy', 'Enterprise ($199/mo)')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $199')).toBeInTheDocument()
    await nav(u, 'Subscribers')
    await u.click(within(subRow('Judy')).getByLabelText(/active judy/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $0')).toBeInTheDocument()
    expect(screen.getByText('Inactive Subscribers: 1')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
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

  it('hide inactive hides inactive subscribers but dashboard still counts them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Karl', 'Pro ($79/mo)')
    await u.click(within(subRow('Karl')).getByLabelText(/active karl/i))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Subscribers')
    expect(screen.queryByText('Karl')).not.toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive Subscribers: 1')).toBeInTheDocument()
  })

  it('subscriber list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Lena', 'Starter ($29/mo)')
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Lena')).toBeInTheDocument()
  })

  it('shows plan name in subscriber row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Mike', 'Enterprise ($199/mo)')
    expect(within(subRow('Mike')).getByText('Enterprise')).toBeInTheDocument()
  })

  it('multiple subscribers accumulate MRR correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'N1', 'Enterprise ($199/mo)')
    await addSubscriber(u, 'N2', 'Pro ($79/mo)')
    await addSubscriber(u, 'N3', 'Starter ($29/mo)')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $307')).toBeInTheDocument()
    expect(screen.getByText('Total Subscribers: 3')).toBeInTheDocument()
  })
})
