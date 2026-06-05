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

describe('Order Tracker (held-out)', () => {
  it('starts with empty order list', () => {
    render(<App />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'All (0)' })).toBeInTheDocument()
  })

  it('whitespace-only name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/customer name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('All button count updates after adding multiple orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Alpha')
    await addOrder(u, 'Beta')
    await addOrder(u, 'Gamma')
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
  })

  it('Shipped filter shows correct count on active button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Delta')
    await addOrder(u, 'Epsilon')
    await u.click(within(orderRow('Delta')).getByRole('button', { name: /advance delta/i }))
    await u.click(within(orderRow('Delta')).getByRole('button', { name: /advance delta/i }))
    await u.click(within(orderRow('Epsilon')).getByRole('button', { name: /advance epsilon/i }))
    await u.click(within(orderRow('Epsilon')).getByRole('button', { name: /advance epsilon/i }))
    await u.click(screen.getByRole('button', { name: /^Shipped$/i }))
    expect(screen.getByRole('button', { name: 'Shipped (2)' })).toBeInTheDocument()
  })

  it('Delivered filter hides orders in other statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Zeta')
    await addOrder(u, 'Eta')
    await u.click(within(orderRow('Zeta')).getByRole('button', { name: /advance zeta/i }))
    await u.click(within(orderRow('Zeta')).getByRole('button', { name: /advance zeta/i }))
    await u.click(within(orderRow('Zeta')).getByRole('button', { name: /advance zeta/i }))
    await u.click(screen.getByRole('button', { name: /^Delivered$/i }))
    expect(screen.getByText('Zeta')).toBeInTheDocument()
    expect(screen.queryByText('Eta')).not.toBeInTheDocument()
  })

  it('clicking All filter after a status filter restores all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Theta')
    await addOrder(u, 'Iota')
    await u.click(within(orderRow('Theta')).getByRole('button', { name: /advance theta/i }))
    await u.click(screen.getByRole('button', { name: /^Packing$/i }))
    expect(screen.queryByText('Iota')).not.toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /all/i }))
    expect(screen.getByText('Theta')).toBeInTheDocument()
    expect(screen.getByText('Iota')).toBeInTheDocument()
  })

  it('Summary Completion rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Kappa')
    await addOrder(u, 'Lambda')
    await addOrder(u, 'Mu')
    await u.click(within(orderRow('Kappa')).getByRole('button', { name: /advance kappa/i }))
    await u.click(within(orderRow('Kappa')).getByRole('button', { name: /advance kappa/i }))
    await u.click(within(orderRow('Kappa')).getByRole('button', { name: /advance kappa/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary updates after advancing an order (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Nu')
    await nav(u, 'Summary')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    await nav(u, 'Orders')
    await u.click(within(orderRow('Nu')).getByRole('button', { name: /advance nu/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Packing: 1')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Xi')
    await addOrder(u, 'Omicron')
    await u.click(within(orderRow('Xi')).getByRole('button', { name: /advance xi/i }))
    await u.click(screen.getByRole('button', { name: /^Packing$/i }))
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByRole('button', { name: 'Packing (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Omicron')).not.toBeInTheDocument()
  })
})
