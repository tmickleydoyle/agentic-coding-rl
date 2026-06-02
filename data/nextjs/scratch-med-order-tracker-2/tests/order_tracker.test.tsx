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

describe('Order Tracker app', () => {
  it('starts on the Orders view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('seeds the list with Alice, Bob, Carol', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows initial status badges correctly', () => {
    render(<App />)
    expect(screen.getByText('new (1)')).toBeInTheDocument()
    expect(screen.getByText('packing (1)')).toBeInTheDocument()
    expect(screen.getByText('shipped (1)')).toBeInTheDocument()
    expect(screen.getByText('delivered (0)')).toBeInTheDocument()
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
    await addOrder(u, 'Dave')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('new (2)')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 orders')).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
  })

  it('advances Alice new -> packing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    expect(screen.getByText('new (0)')).toBeInTheDocument()
    expect(screen.getByText('packing (2)')).toBeInTheDocument()
  })

  it('advance button is disabled for delivered orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    // advance Carol shipped -> delivered
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i })).toBeDisabled()
  })

  it('status badge updates after advancing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(screen.getByText('delivered (1)')).toBeInTheDocument()
    expect(screen.getByText('shipped (0)')).toBeInTheDocument()
  })

  it('filter by status narrows visible orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('filter does not change status badges (all orders counted)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    expect(screen.getByText('new (1)')).toBeInTheDocument()
    expect(screen.getByText('packing (1)')).toBeInTheDocument()
    expect(screen.getByText('shipped (1)')).toBeInTheDocument()
  })

  it('filter All shows all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByText('Showing: 3 orders')).toBeInTheDocument()
  })

  it('Summary shows correct initial totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 0%')).toBeInTheDocument()
  })

  it('Summary fulfillment rate updates after advancing (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // advance Carol shipped -> delivered
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 33%')).toBeInTheDocument()
  })

  it('adding an order reflects in Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Eve')
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 4')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('Settings toggle theme changes data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigations', async () => {
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
    await addOrder(u, 'Frank')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Frank')).toBeInTheDocument()
  })

  it('advancing all the way to delivered shows 100% fulfillment rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    // advance Alice new->packing->shipped->delivered
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Alice')).getByRole('button', { name: /advance alice/i }))
    }
    // advance Bob packing->shipped->delivered
    for (let i = 0; i < 2; i++) {
      await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    }
    // advance Carol shipped->delivered
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Fulfillment rate: 100%')).toBeInTheDocument()
  })
})
