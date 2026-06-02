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

  it('shows Showing: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('navigates to Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Orders', async () => {
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
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('advances order through the pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Bob')
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('packing')).toBeInTheDocument()
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('shipped')).toBeInTheDocument()
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance when delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Carol')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    }
    expect(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i })).toBeDisabled()
  })

  it('filters orders by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Dan')
    await addOrder(u, 'Eve')
    await u.click(within(orderRow('Dan')).getByRole('button', { name: /advance dan/i }))
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'packing')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Dan')).toBeInTheDocument()
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
  })

  it('filter all shows all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Frank')
    await addOrder(u, 'Grace')
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'packing')
    await u.selectOptions(select, 'all')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('Summary shows Total orders: 0 initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 0')).toBeInTheDocument()
  })

  it('Summary reflects cross-view state after adding orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Hank')
    await addOrder(u, 'Ivy')
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('Summary counts per status correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Jack')
    await addOrder(u, 'Kim')
    await u.click(within(orderRow('Jack')).getByRole('button', { name: /advance jack/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
  })

  it('Delivery rate is 0% with no orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 0%')).toBeInTheDocument()
  })

  it('Delivery rate calculates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Lena')
    await addOrder(u, 'Mike')
    for (let i = 0; i < 3; i++) {
      await u.click(within(orderRow('Lena')).getByRole('button', { name: /advance lena/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 50%')).toBeInTheDocument()
  })

  it('Settings shows current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('Toggle theme switches data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Orders')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('order list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Nina')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Nina')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('Showing count updates when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Oscar')
    const select = screen.getByLabelText(/filter by status/i)
    await u.selectOptions(select, 'delivered')
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })
})
