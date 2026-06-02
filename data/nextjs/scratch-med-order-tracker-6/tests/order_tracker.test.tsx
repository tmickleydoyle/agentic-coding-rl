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

  it('shows Showing: 0 orders on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
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

  it('adds an order and shows it as new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Acme Corp')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(within(orderRow('Acme Corp')).getByText('new')).toBeInTheDocument()
  })

  it('updates Showing count after adding orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Alice')
    await addOrder(u, 'Bob')
    expect(screen.getByText('Showing: 2 orders')).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('advances an order status through the pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Widget Co')
    expect(within(orderRow('Widget Co')).getByText('new')).toBeInTheDocument()
    await u.click(within(orderRow('Widget Co')).getByRole('button', { name: /advance widget co/i }))
    expect(within(orderRow('Widget Co')).getByText('packing')).toBeInTheDocument()
    await u.click(within(orderRow('Widget Co')).getByRole('button', { name: /advance widget co/i }))
    expect(within(orderRow('Widget Co')).getByText('shipped')).toBeInTheDocument()
    await u.click(within(orderRow('Widget Co')).getByRole('button', { name: /advance widget co/i }))
    expect(within(orderRow('Widget Co')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance button when order is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Done Co')
    await u.click(within(orderRow('Done Co')).getByRole('button', { name: /advance done co/i }))
    await u.click(within(orderRow('Done Co')).getByRole('button', { name: /advance done co/i }))
    await u.click(within(orderRow('Done Co')).getByRole('button', { name: /advance done co/i }))
    expect(within(orderRow('Done Co')).getByRole('button', { name: /advance done co/i })).toBeDisabled()
  })

  it('filters orders by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Alpha')
    await addOrder(u, 'Beta')
    await u.click(within(orderRow('Alpha')).getByRole('button', { name: /advance alpha/i }))
    // Alpha is packing, Beta is new
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filter all shows every order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'X')
    await addOrder(u, 'Y')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('Showing: 2 orders')).toBeInTheDocument()
  })

  it('Summary shows Total orders: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects orders added on Orders view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'CrossA')
    await addOrder(u, 'CrossB')
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('Summary counts per status correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'P1')
    await addOrder(u, 'P2')
    await u.click(within(orderRow('P1')).getByRole('button', { name: /advance p1/i })) // packing
    await u.click(within(orderRow('P1')).getByRole('button', { name: /advance p1/i })) // shipped
    await nav(u, 'Summary')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 0')).toBeInTheDocument()
  })

  it('Summary shows Fulfillment rate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Q1')
    await addOrder(u, 'Q2')
    await u.click(within(orderRow('Q1')).getByRole('button', { name: /advance q1/i }))
    await u.click(within(orderRow('Q1')).getByRole('button', { name: /advance q1/i }))
    await u.click(within(orderRow('Q1')).getByRole('button', { name: /advance q1/i })) // Q1 delivered
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Fulfillment rate: 50%')).toBeInTheDocument()
  })

  it('Summary ignores the active filter on Orders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Seen')
    await addOrder(u, 'Hidden')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    // filter shows only new — but both orders are new so 2 visible here; advance one to hide it
    await u.click(within(orderRow('Seen')).getByRole('button', { name: /advance seen/i }))
    // now filter shows only 'new', Seen is packing so hidden in Orders
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
    await nav(u, 'Summary')
    // Summary always shows all
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
  })

  it('toggles theme in Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Orders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('order state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Sticky')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Sticky')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('filter selection persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'R1')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    await nav(u, 'Settings')
    await nav(u, 'Orders')
    expect(screen.getByLabelText(/filter by status/i)).toHaveValue('shipped')
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })
})
