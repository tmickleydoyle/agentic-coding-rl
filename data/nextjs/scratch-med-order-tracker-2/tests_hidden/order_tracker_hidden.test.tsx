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
  it('filter by shipped shows only Carol', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('filter delivered initially shows Showing: 0 orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'delivered')
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('after advancing Carol to delivered, filter delivered shows her', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'delivered')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('advancing Bob updates packing badge to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(screen.getByText('packing (0)')).toBeInTheDocument()
    expect(screen.getByText('shipped (2)')).toBeInTheDocument()
  })

  it('Summary Packing count updates when an order is advanced through packing', async () => {
    const u = userEvent.setup()
    render(<App />)
    // advance Alice new->packing
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Packing: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
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

  it('adding multiple orders increments new count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Grace')
    await addOrder(u, 'Heidi')
    expect(screen.getByText('new (3)')).toBeInTheDocument()
    expect(screen.getByText('Showing: 5 orders')).toBeInTheDocument()
  })

  it('Summary reflects two delivered orders at 50% with 4 total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ivan')
    // advance Alice new->delivered (3 steps)
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    }
    // advance Carol shipped->delivered (1 step)
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 4')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 50%')).toBeInTheDocument()
  })

  it('filter persists when advancing an order while filtered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    // advance Alice out of new
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    // now filtered view should show 0
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('Orders view label input is distinct from nav buttons', () => {
    render(<App />)
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument()
  })
})
