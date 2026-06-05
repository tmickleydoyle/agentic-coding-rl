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
  it('starts on Subscribers view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /subscribers \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /subscribers \(3\)/i })).toBeInTheDocument()
  })

  it('shows seed MRR on Dashboard (Alice Pro $79 + Bob Starter $29 = $108, Carol inactive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $108')).toBeInTheDocument()
  })

  it('shows correct active and inactive counts on Dashboard for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 1')).toBeInTheDocument()
  })

  it('shows correct active rate for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active rate: 67%')).toBeInTheDocument()
  })

  it('adds a new subscriber and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Dave', 'Starter ($29/mo)')
    expect(screen.getByRole('heading', { name: /subscribers \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Dave')).toBeInTheDocument()
  })

  it('ignores blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByRole('heading', { name: /subscribers \(3\)/i })).toBeInTheDocument()
  })

  it('new subscriber defaults to active and contributes to MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Eve', 'Pro ($79/mo)')
    await nav(u, 'Dashboard')
    // Alice $79 + Bob $29 + Eve $79 = $187
    expect(screen.getByText('Monthly Recurring Revenue: $187')).toBeInTheDocument()
  })

  it('toggles a subscriber to inactive, removing them from MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Toggle Alice (Pro $79) to inactive
    await u.click(screen.getByRole('button', { name: /toggle active for alice/i }))
    await nav(u, 'Dashboard')
    // Only Bob $29 active now
    expect(screen.getByText('Monthly Recurring Revenue: $29')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
  })

  it('toggles a subscriber from inactive back to active, restoring MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Carol is inactive (Enterprise $199), toggle her active
    await u.click(screen.getByRole('button', { name: /toggle active for carol/i }))
    await nav(u, 'Dashboard')
    // Alice $79 + Bob $29 + Carol $199 = $307
    expect(screen.getByText('Monthly Recurring Revenue: $307')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 3')).toBeInTheDocument()
  })

  it('toggle button label changes between Active and Inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    const toggleBtn = screen.getByRole('button', { name: /toggle active for alice/i })
    expect(toggleBtn).toHaveTextContent('Active')
    await u.click(toggleBtn)
    expect(toggleBtn).toHaveTextContent('Inactive')
  })

  it('removes a subscriber and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bob/i }))
    expect(screen.getByRole('heading', { name: /subscribers \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('removing an active subscriber reduces MRR on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove alice/i }))
    await nav(u, 'Dashboard')
    // Bob $29 active, Carol inactive
    expect(screen.getByText('Monthly Recurring Revenue: $29')).toBeInTheDocument()
  })

  it('shows 0% active rate and $0 MRR when all subscribers removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset subscribers/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $0')).toBeInTheDocument()
    expect(screen.getByText('Active rate: 0%')).toBeInTheDocument()
  })

  it('reset subscribers clears the subscriber list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset subscribers/i }))
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: /subscribers \(0\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Subscribers')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('adding an Enterprise subscriber updates MRR correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Frank', 'Enterprise ($199/mo)')
    await nav(u, 'Dashboard')
    // Alice $79 + Bob $29 + Frank $199 = $307
    expect(screen.getByText('Monthly Recurring Revenue: $307')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Grace', 'Pro ($79/mo)')
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: /subscribers \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })
})
