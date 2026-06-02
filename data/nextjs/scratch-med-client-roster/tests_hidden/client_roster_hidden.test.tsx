// HELD-OUT generalization tests — overlaid only at eval, never seen during training.
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
  it('initial total value is sum of all three seeded clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $7000.00')).toBeInTheDocument()
  })

  it('Showing count updates to 0 when churned filter has no matches after remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await u.click(screen.getByRole('button', { name: 'Churned' }))
    expect(screen.getByText('Showing: 0 clients')).toBeInTheDocument()
  })

  it('adding a churned client increases Churned count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'OldCo', 'churned', '400')
    await nav(u, 'Summary')
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
  })

  it('active value does not include lead or churned clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'BigLead', 'lead', '9000')
    await nav(u, 'Summary')
    expect(screen.getByText('Active value: $5000.00')).toBeInTheDocument()
  })

  it('removing all clients shows 0 in every summary field', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 0')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('filter does not affect Summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
  })

  it('newly added client is visible under correct status filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'NewLead Inc', 'lead', '750')
    await u.click(screen.getByRole('button', { name: 'Lead' }))
    expect(screen.getByText('NewLead Inc')).toBeInTheDocument()
    expect(screen.getByText('$750.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 clients')).toBeInTheDocument()
  })

  it('newly added client is not visible under a different status filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'SecretAgent', 'active', '1111')
    await u.click(screen.getByRole('button', { name: 'Churned' }))
    expect(screen.queryByText('SecretAgent')).not.toBeInTheDocument()
  })

  it('double theme toggle returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('roster state persists after navigating to Settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Persistent LLC', 'active', '3333')
    await nav(u, 'Settings')
    await nav(u, 'Roster')
    expect(screen.getByText('Persistent LLC')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })
})
