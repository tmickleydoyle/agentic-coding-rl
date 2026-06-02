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

describe('Client Roster (held-out)', () => {
  it('seeded churned client shows correct status label', () => {
    render(<App />)
    const li = screen.getByText('Initech').closest('li') as HTMLElement
    expect(within(li).getByText('churned')).toBeInTheDocument()
  })

  it('adding two active clients raises Active count by 2 in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Corp A', 'active', '2000')
    await addClient(u, 'Corp B', 'active', '3000')
    await nav(u, 'Summary')
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('active value is sum of active clients only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'X', 'active', '1000')
    await nav(u, 'Summary')
    expect(screen.getByText('Active value: $6000.00')).toBeInTheDocument()
  })

  it('deleting all clients shows Showing: 0 clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    expect(screen.getByText('Showing: 0 clients')).toBeInTheDocument()
  })

  it('Summary shows zeros when all clients deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('filter Active after adding an active client shows 2 clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'SecondActive', 'active', '100')
    await u.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByText('Showing: 2 clients')).toBeInTheDocument()
  })

  it('filter does not affect Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
  })

  it('double-toggle theme returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('newly added churned client increments Churned in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'OldCo', 'churned', '500')
    await nav(u, 'Summary')
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
  })

  it('total value includes churned and lead clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'LeadBig', 'lead', '1000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $9200.00')).toBeInTheDocument()
  })

  it('Churned filter hides active and lead clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Churned' }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })
})
