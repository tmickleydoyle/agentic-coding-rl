// HELD-OUT generalization tests — fresh scenarios, edge cases, different sequences.
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
  it('initial Summary shows all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Packing: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered rate: 0%')).toBeInTheDocument()
  })

  it('adding multiple orders increments Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Alpha')
    await addOrder(u, 'Beta')
    await addOrder(u, 'Gamma')
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
  })

  it('New filter shows only new orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Uno')
    await addOrder(u, 'Dos')
    await u.click(within(orderRow('Uno')).getByRole('button', { name: /advance uno/i }))
    // Uno is packing, Dos is new
    await u.click(screen.getByRole('button', { name: 'New' }))
    expect(screen.getByText('Dos')).toBeInTheDocument()
    expect(screen.queryByText('Uno')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('Shipped filter updates Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Fox')
    await addOrder(u, 'Gull')
    await u.click(within(orderRow('Fox')).getByRole('button', { name: /advance fox/i }))
    await u.click(within(orderRow('Fox')).getByRole('button', { name: /advance fox/i }))
    // Fox shipped, Gull new
    await u.click(screen.getByRole('button', { name: 'Shipped' }))
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Fox')).toBeInTheDocument()
  })

  it('advancing an order beyond delivered keeps it delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Max')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Max')).getByRole('button', { name: /advance max/i }))
    }
    // button should be disabled now, status stays delivered
    expect(within(orderRow('Max')).getByText('delivered')).toBeInTheDocument()
    expect(within(orderRow('Max')).getByRole('button', { name: /advance max/i })).toBeDisabled()
  })

  it('Summary updates in real-time after advancing an order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Nora')
    await u.click(within(orderRow('Nora')).getByRole('button', { name: /advance nora/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    await nav(u, 'Orders')
    await u.click(within(orderRow('Nora')).getByRole('button', { name: /advance nora/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Packing: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('100% delivered rate when all orders are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Zara')
    await addOrder(u, 'Yuri')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Zara')).getByRole('button', { name: /advance zara/i }))
    }
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Yuri')).getByRole('button', { name: /advance yuri/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
  })

  it('toggle theme button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
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

  it('filter state is local to Orders view and does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Pip')
    await addOrder(u, 'Quinn')
    await u.click(within(orderRow('Pip')).getByRole('button', { name: /advance pip/i }))
    await u.click(screen.getByRole('button', { name: 'Packing' }))
    // only Pip visible in Orders
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    await nav(u, 'Summary')
    // Summary should still count both
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
  })
})
