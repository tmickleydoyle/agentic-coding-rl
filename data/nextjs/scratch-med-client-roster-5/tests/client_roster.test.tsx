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

function clientRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Client Roster app', () => {
  it('starts on the Roster view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Bright Labs')).toBeInTheDocument()
    expect(screen.getByText('Cloud Nine')).toBeInTheDocument()
    expect(screen.getByText('Delta Works')).toBeInTheDocument()
  })

  it('shows seed client values formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$12000.00')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
    expect(screen.getByText('$4500.00')).toBeInTheDocument()
    expect(screen.getByText('$8750.00')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('shows correct seed stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $25250.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $20750.00')).toBeInTheDocument()
  })

  it('adds a new client and shows it in the roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Echo Inc', '5000', 'lead')
    expect(screen.getByText('Echo Inc')).toBeInTheDocument()
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/lifetime value/i))
    await u.type(screen.getByLabelText(/lifetime value/i), '100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    // still only 4 seed clients
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('removes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bright labs/i }))
    expect(screen.queryByText('Bright Labs')).not.toBeInTheDocument()
  })

  it('filters roster by active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Delta Works')).toBeInTheDocument()
    expect(screen.queryByText('Bright Labs')).not.toBeInTheDocument()
    expect(screen.queryByText('Cloud Nine')).not.toBeInTheDocument()
  })

  it('filters roster by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'lead')
    expect(screen.getByText('Bright Labs')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters roster by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.getByText('Cloud Nine')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Bright Labs')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('stats count unaffected by filter (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Total value: $25250.00')).toBeInTheDocument()
  })

  it('adding a client updates stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Foxtrot Co', '3000', 'active')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 5')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $28250.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $23750.00')).toBeInTheDocument()
  })

  it('removing a client updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove cloud nine/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $20750.00')).toBeInTheDocument()
  })

  it('toggles theme to dark in Settings', async () => {
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
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('roster state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Ghost LLC', '999', 'churned')
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect(screen.getByText('Ghost LLC')).toBeInTheDocument()
  })

  it('adding a lead client shows up in Stats Leads count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Horizon Ltd', '0', 'lead')
    await nav(u, 'Stats')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('active value excludes lead and churned clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'IceCo', '10000', 'lead')
    await nav(u, 'Stats')
    expect(screen.getByText('Active value: $20750.00')).toBeInTheDocument()
  })

  it('shows status label in each client row', () => {
    render(<App />)
    const acmeRow = clientRow('Acme Corp')
    expect(within(acmeRow).getByText('active')).toBeInTheDocument()
    const cloudRow = clientRow('Cloud Nine')
    expect(within(cloudRow).getByText('churned')).toBeInTheDocument()
  })
})
