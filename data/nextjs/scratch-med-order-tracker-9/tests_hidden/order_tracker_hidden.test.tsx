// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addOrder(u: U, name: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), name)
  await u.click(screen.getByRole('button', { name: /add order/i }))
}

function orderRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Order Tracker (held-out)', () => {
  it('advance button label includes customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Skyline Ltd')
    expect(screen.getByRole('button', { name: /advance skyline ltd/i })).toBeInTheDocument()
  })

  it('delivered orders are disabled immediately on reaching delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Orbit Inc')
    const btn = within(orderRow('Orbit Inc')).getByRole('button', { name: /advance orbit inc/i })
    expect(btn).not.toBeDisabled()
    await u.click(btn) // packing
    await u.click(btn) // shipped
    await u.click(btn) // delivered
    expect(btn).toBeDisabled()
  })

  it('filtering by delivered shows only delivered orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Apex')
    await addOrder(u, 'Nexus')
    await u.click(within(orderRow('Apex')).getByRole('button', { name: /advance apex/i }))
    await u.click(within(orderRow('Apex')).getByRole('button', { name: /advance apex/i }))
    await u.click(within(orderRow('Apex')).getByRole('button', { name: /advance apex/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'delivered')
    expect(screen.getByText('Apex')).toBeInTheDocument()
    expect(screen.queryByText('Nexus')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
  })

  it('filtering by shipped shows count zero when none are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Crest Co')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
  })

  it('summary new count decrements when order is advanced', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Frost LLC')
    await addOrder(u, 'Grove Ltd')
    await u.click(within(orderRow('Frost LLC')).getByRole('button', { name: /advance frost llc/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/new: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/packing: 1/i)).toBeInTheDocument()
  })

  it('completion rounds correctly for 1 of 4 delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const name of ['A1', 'B2', 'C3', 'D4']) {
      await addOrder(u, name)
    }
    await u.click(within(orderRow('A1')).getByRole('button', { name: /advance a1/i }))
    await u.click(within(orderRow('A1')).getByRole('button', { name: /advance a1/i }))
    await u.click(within(orderRow('A1')).getByRole('button', { name: /advance a1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 25%/i)).toBeInTheDocument()
  })

  it('reset then add new order restarts cleanly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Old Order')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset orders/i }))
    await nav(u, 'Orders')
    await addOrder(u, 'Fresh Start')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Fresh Start')).toBeInTheDocument()
    expect(screen.queryByText('Old Order')).not.toBeInTheDocument()
  })

  it('summary shows shipped count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Wave Co')
    await u.click(within(orderRow('Wave Co')).getByRole('button', { name: /advance wave co/i }))
    await u.click(within(orderRow('Wave Co')).getByRole('button', { name: /advance wave co/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/packing: 0/i)).toBeInTheDocument()
  })

  it('multiple resets result in clean summary state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Temp One')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset orders/i }))
    await nav(u, 'Orders')
    await addOrder(u, 'Temp Two')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset orders/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/new: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
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
})
