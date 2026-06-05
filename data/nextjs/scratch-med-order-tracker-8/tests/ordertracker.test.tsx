import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function orderRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Order Tracker app', () => {
  it('starts on the Orders view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /orders \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
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

  it('navigates back to Orders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: /orders/i })).toBeInTheDocument()
  })

  it('adds a new order with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/customer name/i))
    await u.type(screen.getByLabelText(/customer name/i), 'Dave')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /orders \(4\)/i })).toBeInTheDocument()
    expect(within(orderRow('Dave')).getByText('new')).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByRole('heading', { name: /orders \(3\)/i })).toBeInTheDocument()
  })

  it('advances an order status step by step', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Alice starts as 'new'
    expect(within(orderRow('Alice')).getByText('new')).toBeInTheDocument()
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('packing')).toBeInTheDocument()
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('shipped')).toBeInTheDocument()
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance button when order is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance Alice to delivered
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i })).toBeDisabled()
  })

  it('filters orders by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filter All shows all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByRole('heading', { name: /orders \(3\)/i })).toBeInTheDocument()
  })

  it('filter does not affect Summary totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 3/i)).toBeInTheDocument()
  })

  it('Summary shows seeded counts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/new: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/packing: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/delivered: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('Summary updates when an order is advanced (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance Alice all the way to delivered
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/delivered: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('Summary completion is 100% when all orders delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance all three to delivered
    // Alice: new -> packing -> shipped -> delivered
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    // Bob: packing -> shipped -> delivered
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    // Carol: shipped -> delivered
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('adds a new order and Summary total increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), 'Eve')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/new: 2/i)).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Orders')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('toggles theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), 'Frank')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })

  it('filter state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
  })

  it('filter new status shows only new orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('delivered filter shows zero initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'delivered')
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
  })
})
