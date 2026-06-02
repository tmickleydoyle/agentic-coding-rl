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

describe('Client Roster app', () => {
  it('starts on the Roster view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('shows seeded clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded lifetime values formatted with dollar sign', () => {
    render(<App />)
    expect(within(clientRow('Acme Corp')).getByText('$12000')).toBeInTheDocument()
    expect(within(clientRow('Initech')).getByText('$4500')).toBeInTheDocument()
  })

  it('shows seeded client statuses', () => {
    render(<App />)
    expect(within(clientRow('Acme Corp')).getByText('active')).toBeInTheDocument()
    expect(within(clientRow('Globex')).getByText('lead')).toBeInTheDocument()
    expect(within(clientRow('Initech')).getByText('churned')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Roster view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Roster')
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('shows correct seed stats in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $16500')).toBeInTheDocument()
    expect(screen.getByText('Active value: $12000')).toBeInTheDocument()
  })

  it('adds a new active client and it appears in the roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella Corp', '9000', 'active')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(within(clientRow('Umbrella Corp')).getByText('$9000')).toBeInTheDocument()
    expect(within(clientRow('Umbrella Corp')).getByText('active')).toBeInTheDocument()
  })

  it('ignores adding a client with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/client name/i))
    await u.type(screen.getByLabelText(/lifetime value/i), '500')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    // still only 3 seeded clients visible
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('deletes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('deleting a client updates Summary totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $12000')).toBeInTheDocument()
  })

  it('filters clients by status active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters clients by status lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'lead')
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters clients by status churned', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('filter all shows all clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('adds a lead client and Summary reflects it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'NewCo', '0', 'lead')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('roster state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'PersistCo', '3000', 'active')
    await nav(u, 'Summary')
    await nav(u, 'Roster')
    expect(screen.getByText('PersistCo')).toBeInTheDocument()
  })

  it('Summary active value updates after adding an active client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'BigSpender', '8000', 'active')
    await nav(u, 'Summary')
    expect(screen.getByText('Active value: $20000')).toBeInTheDocument()
  })
})
