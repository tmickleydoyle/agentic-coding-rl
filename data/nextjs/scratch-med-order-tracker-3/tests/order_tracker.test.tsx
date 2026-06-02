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

  it('shows Showing: 0 order(s) initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 order(s)')).toBeInTheDocument()
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
    await addOrder(u, 'Alice')
    const row = orderRow('Alice')
    expect(within(row).getByText('new')).toBeInTheDocument()
  })

  it('shows Showing: 1 order(s) after adding one order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Bob')
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 0 order(s)')).toBeInTheDocument()
  })

  it('advances an order from new to packing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Carol')
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(within(orderRow('Carol')).getByText('packing')).toBeInTheDocument()
  })

  it('advances through the full pipeline to delivered and disables Advance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Dave')
    const advance = () => within(orderRow('Dave')).getByRole('button', { name: /advance dave/i })
    await u.click(advance())
    expect(within(orderRow('Dave')).getByText('packing')).toBeInTheDocument()
    await u.click(advance())
    expect(within(orderRow('Dave')).getByText('shipped')).toBeInTheDocument()
    await u.click(advance())
    expect(within(orderRow('Dave')).getByText('delivered')).toBeInTheDocument()
    expect(advance()).toBeDisabled()
  })

  it('filters orders by status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Eve')
    await addOrder(u, 'Frank')
    await u.click(within(orderRow('Eve')).getByRole('button', { name: /advance eve/i }))
    await u.click(screen.getByRole('button', { name: 'new' }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Grace')
    await addOrder(u, 'Hank')
    await u.click(within(orderRow('Grace')).getByRole('button', { name: /advance grace/i }))
    await u.click(screen.getByRole('button', { name: 'packing' }))
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 order(s)')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Iris')
    await u.click(screen.getByRole('button', { name: 'packing' }))
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Showing: 0 order(s)')).toBeInTheDocument()
  })

  it('Summary shows total orders 0 and Completion: 0% with no orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary counts all statuses correctly (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Jake')
    await addOrder(u, 'Kim')
    await addOrder(u, 'Leo')
    const advance = (name: string) =>
      u.click(within(orderRow(name)).getByRole('button', { name: new RegExp(`advance ${name}`, 'i') }))
    await advance('Jake')
    await advance('Jake') // Jake -> shipped
    await advance('Kim')  // Kim -> packing
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
  })

  it('Summary Completion: 50% when half delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Mia')
    await addOrder(u, 'Ned')
    const advanceFull = async (name: string) => {
      for (let i = 0; i < 3; i++) {
        await u.click(within(orderRow(name)).getByRole('button', { name: new RegExp(`advance ${name}`, 'i') }))
      }
    }
    await advanceFull('Mia')
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Summary ignores filter — counts all orders regardless', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ora')
    await addOrder(u, 'Pat')
    await u.click(screen.getByRole('button', { name: 'new' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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

  it('orders list is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Quinn')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Quinn')).toBeInTheDocument()
  })

  it('most recently added order appears at the top', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'First')
    await addOrder(u, 'Second')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Second')).toBeInTheDocument()
    expect(within(items[1]).getByText('First')).toBeInTheDocument()
  })

  it('Showing count updates correctly after filter changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Rex')
    await addOrder(u, 'Sara')
    await u.click(within(orderRow('Rex')).getByRole('button', { name: /advance rex/i }))
    await u.click(within(orderRow('Rex')).getByRole('button', { name: /advance rex/i }))
    await u.click(within(orderRow('Rex')).getByRole('button', { name: /advance rex/i }))
    await u.click(screen.getByRole('button', { name: 'delivered' }))
    expect(screen.getByText('Showing: 1 order(s)')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'shipped' }))
    expect(screen.getByText('Showing: 0 order(s)')).toBeInTheDocument()
  })
})
