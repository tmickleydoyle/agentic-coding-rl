import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClient(u: U, name: string, status: string, value: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.clear(screen.getByLabelText('Lifetime Value'))
  await u.type(screen.getByLabelText('Lifetime Value'), value)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster (held-out)', () => {
  it('initial visible total is sum of all three seeded clients', () => {
    render(<App />)
    expect(screen.getByText('Visible Total: $7000.00')).toBeInTheDocument()
  })

  it('adds two clients and visible total updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Dunder', 'active', '400')
    await addClient(u, 'Sabre', 'lead', '600')
    expect(screen.getByText('Visible: 5 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $8000.00')).toBeInTheDocument()
  })

  it('filter then add client of same status shows in filtered list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lead')
    await addClient(u, 'Pawnee', 'lead', '750')
    expect(screen.getByText('Pawnee')).toBeInTheDocument()
    expect(screen.getByText('Visible: 2 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $1950.00')).toBeInTheDocument()
  })

  it('filter then add client of different status does not show in filtered list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    await addClient(u, 'NewActive', 'active', '300')
    expect(screen.queryByText('NewActive')).not.toBeInTheDocument()
    expect(screen.getByText('Visible: 1 clients')).toBeInTheDocument()
  })

  it('removing a seeded client updates visible total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Initech' }))
    expect(screen.getByText('Visible Total: $6200.00')).toBeInTheDocument()
  })

  it('summary Leads count increases when lead client added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Extras Inc', 'lead', '100')
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('summary Churned count increases when churned client added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Gone Ltd', 'churned', '50')
    await nav(u, 'Summary')
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
  })

  it('active value in summary does not include lead or churned', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Active Value: $5000.00')).toBeInTheDocument()
  })

  it('removing all active clients sets Active Value to $0.00 in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Acme Corp' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active Value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
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

  it('churned filter visible total equals only churned client values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Stale Co', 'churned', '200')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByText('Visible Total: $1000.00')).toBeInTheDocument()
  })

  it('total lifetime value in summary includes all statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'AllTypes', 'active', '100')
    await nav(u, 'Summary')
    expect(screen.getByText('Total Lifetime Value: $7100.00')).toBeInTheDocument()
  })
})
