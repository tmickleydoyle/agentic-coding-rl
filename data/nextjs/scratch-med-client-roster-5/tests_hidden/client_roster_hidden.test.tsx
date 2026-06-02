import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClient(u: U, name: string, value: string, status: string) {
  await u.clear(screen.getByLabelText(/client name/i))
  await u.type(screen.getByLabelText(/client name/i), name)
  await u.clear(screen.getByLabelText(/lifetime value/i))
  await u.type(screen.getByLabelText(/lifetime value/i), value)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster (held-out)', () => {
  it('seed total value is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total value: $25250.00')).toBeInTheDocument()
  })

  it('adding two active clients updates active count and active value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Jupiter Co', '2000', 'active')
    await addClient(u, 'Kappa Inc', '3000', 'active')
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 4')).toBeInTheDocument()
    expect(screen.getByText('Active value: $25750.00')).toBeInTheDocument()
  })

  it('removing all active clients sets active value to $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove delta works/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('filter persists when navigating to stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'lead')
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect(screen.getByText('Bright Labs')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('churned filter shows only churned clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Lambda Ltd', '1500', 'churned')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.getByText('Cloud Nine')).toBeInTheDocument()
    expect(screen.getByText('Lambda Ltd')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('stats churned count includes newly added churned clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'MegaCo', '0', 'churned')
    await nav(u, 'Stats')
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
  })

  it('stats reflect removal of a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bright labs/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
  })

  it('new lead client with value does not change active value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Nova LLC', '9999', 'lead')
    await nav(u, 'Stats')
    expect(screen.getByText('Active value: $20750.00')).toBeInTheDocument()
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('dollar format shows two decimal places for whole numbers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Oracle Co', '5000', 'active')
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
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

  it('shows status in row for newly added client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Pioneer Co', '777', 'lead')
    const row = screen.getByText('Pioneer Co').closest('li') as HTMLElement
    expect(within(row).getByText('lead')).toBeInTheDocument()
    expect(within(row).getByText('$777.00')).toBeInTheDocument()
  })
})
