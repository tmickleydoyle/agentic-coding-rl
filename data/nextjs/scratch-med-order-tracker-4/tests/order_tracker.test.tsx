import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addOrder(u: U, customer: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
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

  it('ignores a blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('Advance button moves order from new to packing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Bob')
    await u.click(within(orderRow('Bob')).getByRole('button', { name: /advance bob/i }))
    expect(within(orderRow('Bob')).getByText('packing')).toBeInTheDocument()
  })

  it('Advance button moves order through all statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Carol')
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    await u.click(within(orderRow('Carol')).getByRole('button', { name: /advance carol/i }))
    expect(within(orderRow('Carol')).getByText('delivered')).toBeInTheDocument()
  })

  it('Advance button is disabled when status is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Dave')
    await u.click(within(orderRow('Dave')).getByRole('button', { name: /advance dave/i }))
    await u.click(within(orderRow('Dave')).getByRole('button', { name: /advance dave/i }))
    await u.click(within(orderRow('Dave')).getByRole('button', { name: /advance dave/i }))
    expect(within(orderRow('Dave')).getByRole('button', { name: /advance dave/i })).toBeDisabled()
  })

  it('All filter button shows total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Eve')
    await addOrder(u, 'Frank')
    expect(screen.getByRole('button', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('active filter button shows count for that status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Grace')
    await addOrder(u, 'Heidi')
    await u.click(screen.getByRole('button', { name: /^New$/i }))
    expect(screen.getByRole('button', { name: 'New (2)' })).toBeInTheDocument()
  })

  it('filter hides orders not matching the selected status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Ivan')
    await addOrder(u, 'Judy')
    await u.click(within(orderRow('Ivan')).getByRole('button', { name: /advance ivan/i }))
    await u.click(screen.getByRole('button', { name: /^Packing$/i }))
    expect(screen.getByText('Ivan')).toBeInTheDocument()
    expect(screen.queryByText('Judy')).not.toBeInTheDocument()
  })

  it('Summary shows total orders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Karl')
    await addOrder(u, 'Lena')
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
  })

  it('Summary shows per-status counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Mia')
    await addOrder(u, 'Ned')
    await u.click(within(orderRow('Mia')).getByRole('button', { name: /advance mia/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
  })

  it('Summary Completion is 0% with no orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary Completion reflects delivered orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Olivia')
    await addOrder(u, 'Pete')
    await u.click(within(orderRow('Olivia')).getByRole('button', { name: /advance olivia/i }))
    await u.click(within(orderRow('Olivia')).getByRole('button', { name: /advance olivia/i }))
    await u.click(within(orderRow('Olivia')).getByRole('button', { name: /advance olivia/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Summary counts all orders even when a filter is active on Orders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Quinn')
    await addOrder(u, 'Rosa')
    await u.click(screen.getByRole('button', { name: /^Packing$/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total orders: 2')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Sam')
    await nav(u, 'Settings')
    await nav(u, 'Orders')
    expect(screen.getByText('Sam')).toBeInTheDocument()
  })

  it('toggles theme to dark via data-theme attribute', async () => {
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
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Orders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
