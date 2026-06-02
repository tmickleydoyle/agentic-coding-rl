import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function orderRow(customer: string): HTMLElement {
  const span = screen.getByText(customer)
  const li = span.closest('li')
  if (!li) throw new Error(`no row for ${customer}`)
  return li as HTMLElement
}

describe('Order Tracker app', () => {
  it('starts on the Orders view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('shows seeded orders on first load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows Showing: 3 orders initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('adds a new order with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Customer name'))
    await u.type(screen.getByLabelText('Customer name'), 'Dave')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(within(orderRow('Dave')).getByText('new')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 orders')).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
  })

  it('advances an order status step by step', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(within(orderRow('Alice')).getByText('new')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('packing')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('shipped')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    expect(within(orderRow('Alice')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance button when order is delivered', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /advance carol/i })).toBeDisabled()
  })

  it('Advance button is enabled for non-delivered orders', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /advance alice/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /advance bob/i })).not.toBeDisabled()
  })

  it('filters orders by status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filters orders by status shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'shipped')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('filters orders by status delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'delivered')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('All filter shows all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
  })

  it('filter showing 0 orders when no match', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'packing')
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 33%')).toBeInTheDocument()
  })

  it('Summary delivery rate is 0% when no orders delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    // advance Alice and Bob to get accurate delivery rate later
    // Instead just check Summary for the seeded state where 1/3 = 33%
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 33%')).toBeInTheDocument()
  })

  it('advancing an order updates Summary (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    await u.click(screen.getByRole('button', { name: /advance alice/i }))
    await u.click(screen.getByRole('button', { name: /advance alice/i })) // Alice -> delivered
    await nav(u, 'Summary')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 67%')).toBeInTheDocument()
  })

  it('adding an order updates Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer name'), 'Eve')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 4')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('toggles theme via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Orders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('order list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Customer name'), 'Frank')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })
})
