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

  it('shows Showing: 0 orders initially', () => {
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

  it('navigates back to Orders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('adds an order with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Alice')
    expect(within(orderRow('Alice')).getByText('new')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('advances an order through the pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Bob')
    expect(within(orderRow('Bob')).getByText('new')).toBeInTheDocument()
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('packing')).toBeInTheDocument()
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('shipped')).toBeInTheDocument()
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance button when order is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Carol')
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i })).toBeDisabled()
  })

  it('filters orders by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Dave')
    await addOrder(u, 'Eve')
    await u.click(within(orderRow('Dave')).getByRole('button', { name: /advance dave/i }))
    // Dave is packing, Eve is new
    await u.click(screen.getByRole('button', { name: 'Packing' }))
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('All filter shows every order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Frank')
    await addOrder(u, 'Grace')
    await u.click(within(orderRow('Frank')).getByRole('button', { name: /advance frank/i }))
    await u.click(screen.getByRole('button', { name: 'Packing' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 orders')).toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })

  it('filter shows 0 when none match', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Hank')
    await u.click(screen.getByRole('button', { name: 'Shipped' }))
    expect(screen.getByText('Showing: 0 orders')).toBeInTheDocument()
  })

  it('Summary shows 0% delivered rate when no orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects cross-view state (orders added on Orders view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ivy')
    await addOrder(u, 'Jack')
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered rate: 0%')).toBeInTheDocument()
  })

  it('Summary counts per status correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Kate')
    await addOrder(u, 'Leo')
    await u.click(within(orderRow('Kate')).getByRole('button', { name: /advance kate/i }))
    await u.click(within(orderRow('Kate')).getByRole('button', { name: /advance kate/i }))
    await u.click(within(orderRow('Kate')).getByRole('button', { name: /advance kate/i }))
    // Kate delivered, Leo new
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered rate: 50%')).toBeInTheDocument()
  })

  it('Summary packing and shipped counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Mia')
    await addOrder(u, 'Ned')
    await u.click(within(orderRow('Mia')).getByRole('button', { name: /advance mia/i }))
    await u.click(within(orderRow('Ned')).getByRole('button', { name: /advance ned/i }))
    await u.click(within(orderRow('Ned')).getByRole('button', { name: /advance ned/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('Summary delivered rate rounds correctly for thirds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ona')
    await addOrder(u, 'Pete')
    await addOrder(u, 'Quinn')
    await u.click(within(orderRow('Ona')).getByRole('button', { name: /advance ona/i }))
    await u.click(within(orderRow('Ona')).getByRole('button', { name: /advance ona/i }))
    await u.click(within(orderRow('Ona')).getByRole('button', { name: /advance ona/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered rate: 33%')).toBeInTheDocument()
  })

  it('toggles theme and data-theme attribute updates', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
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

  it('orders state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Rita')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Rita')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })

  it('Delivered filter shows only delivered orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Sam')
    await addOrder(u, 'Tina')
    await u.click(within(orderRow('Sam')).getByRole('button', { name: /advance sam/i }))
    await u.click(within(orderRow('Sam')).getByRole('button', { name: /advance sam/i }))
    await u.click(within(orderRow('Sam')).getByRole('button', { name: /advance sam/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Sam')).toBeInTheDocument()
    expect(screen.queryByText('Tina')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 orders')).toBeInTheDocument()
  })
})
