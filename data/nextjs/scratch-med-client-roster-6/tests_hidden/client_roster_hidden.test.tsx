import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function clientRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

async function addClient(u: U, name: string, value: string, status: string) {
  await u.clear(screen.getByLabelText(/client name/i))
  await u.type(screen.getByLabelText(/client name/i), name)
  await u.clear(screen.getByLabelText(/lifetime value/i))
  await u.type(screen.getByLabelText(/lifetime value/i), value)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster (held-out)', () => {
  it('deleting Acme Corp reduces active count in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0')).toBeInTheDocument()
  })

  it('deleting Globex reduces leads count in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
  })

  it('adds a churned client with value and Summary total value reflects it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'OldClient', '2000', 'churned')
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $18500')).toBeInTheDocument()
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
  })

  it('newly added lead does not change active value in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'ProspectX', '5000', 'lead')
    await nav(u, 'Summary')
    expect(screen.getByText('Active value: $12000')).toBeInTheDocument()
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('filter by active hides churned and lead clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'FreshLead', '0', 'lead')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    expect(screen.queryByText('FreshLead')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('Summary counts are unaffected by the Roster filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
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

  it('seeded Globex shows $0 value', () => {
    render(<App />)
    expect(within(clientRow('Globex')).getByText('$0')).toBeInTheDocument()
  })

  it('Roster filter state does not persist to Summary calculations', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $16500')).toBeInTheDocument()
  })

  it('adding multiple clients increments Summary total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Alpha Inc', '3000', 'active')
    await addClient(u, 'Beta LLC', '7000', 'active')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 5')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $26500')).toBeInTheDocument()
    expect(screen.getByText('Active value: $22000')).toBeInTheDocument()
  })
})
