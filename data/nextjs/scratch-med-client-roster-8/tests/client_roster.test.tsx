import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClient(u: U, name: string, status: string, lv: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.clear(screen.getByLabelText('Lifetime Value'))
  await u.type(screen.getByLabelText('Lifetime Value'), lv)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster app', () => {
  it('starts on the Clients view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
  })

  it('shows seeded clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded lifetime values formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
    expect(screen.getByText('$3200.00')).toBeInTheDocument()
  })

  it('shows Showing: 3 clients on load with All filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Clients')
    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
  })

  it('adds a new client and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'NewCo', 'active', '999')
    expect(screen.getByText('NewCo')).toBeInTheDocument()
    expect(screen.getByText('$999.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })

  it('ignores a client with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Name'))
    await u.type(screen.getByLabelText('Lifetime Value'), '100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('deletes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 clients')).toBeInTheDocument()
  })

  it('filters by Active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by Lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Lead' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('filters by Churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Churned' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('Summary shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $8200.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5000.00')).toBeInTheDocument()
  })

  it('Summary updates after adding a client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'NewCo', 'active', '800')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $9000.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5800.00')).toBeInTheDocument()
  })

  it('Summary updates after deleting a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $3200.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('theme starts light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view changes', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Clients')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'StayClient', 'lead', '1500')
    await nav(u, 'Summary')
    await nav(u, 'Clients')
    expect(screen.getByText('StayClient')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    await nav(u, 'Clients')
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('a new lead client is counted in Leads on Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'ProspectA', 'lead', '0')
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })
})
