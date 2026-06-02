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
  it('starts on the Orders view with zero orders', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('adds an order and shows it with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Acme Corp')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(within(orderRow('Acme Corp')).getByText('new')).toBeInTheDocument()
  })

  it('ignores blank customer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add order/i }))
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
  })

  it('updates visible count heading after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Beta LLC')
    await addOrder(u, 'Gamma Inc')
    expect(screen.getByRole('heading', { name: /orders \(2\)/i })).toBeInTheDocument()
  })

  it('advances order status through the sequence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Delta Co')
    expect(within(orderRow('Delta Co')).getByText('new')).toBeInTheDocument()
    await u.click(within(orderRow('Delta Co')).getByRole('button', { name: /advance delta co/i }))
    expect(within(orderRow('Delta Co')).getByText('packing')).toBeInTheDocument()
    await u.click(within(orderRow('Delta Co')).getByRole('button', { name: /advance delta co/i }))
    expect(within(orderRow('Delta Co')).getByText('shipped')).toBeInTheDocument()
    await u.click(within(orderRow('Delta Co')).getByRole('button', { name: /advance delta co/i }))
    expect(within(orderRow('Delta Co')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Advance button when order is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Epsilon Ltd')
    const btn = within(orderRow('Epsilon Ltd')).getByRole('button', { name: /advance epsilon ltd/i })
    await u.click(btn)
    await u.click(btn)
    await u.click(btn)
    expect(btn).toBeDisabled()
  })

  it('filters orders by status — only matching rows visible', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Zeta Corp')
    await addOrder(u, 'Eta Inc')
    await u.click(within(orderRow('Eta Inc')).getByRole('button', { name: /advance eta inc/i }))
    // filter to packing
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    expect(screen.queryByText('Zeta Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Eta Inc')).toBeInTheDocument()
  })

  it('heading count reflects filtered count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Theta Co')
    await addOrder(u, 'Iota Co')
    await u.click(within(orderRow('Theta Co')).getByRole('button', { name: /advance theta co/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByRole('heading', { name: /orders \(1\)/i })).toBeInTheDocument()
  })

  it('All filter shows all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Kappa')
    await addOrder(u, 'Lambda')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByRole('heading', { name: /orders \(2\)/i })).toBeInTheDocument()
  })

  it('Summary shows zero stats with no orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('Summary reflects orders added on the Orders view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Mu Inc')
    await addOrder(u, 'Nu Ltd')
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/new: 2/i)).toBeInTheDocument()
  })

  it('Summary tracks packing and shipped counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Xi Co')
    await addOrder(u, 'Omicron')
    await u.click(within(orderRow('Xi Co')).getByRole('button', { name: /advance xi co/i }))
    await u.click(within(orderRow('Omicron')).getByRole('button', { name: /advance omicron/i }))
    await u.click(within(orderRow('Omicron')).getByRole('button', { name: /advance omicron/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/packing: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
  })

  it('Summary Completion% is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Pi Corp')
    await addOrder(u, 'Rho Corp')
    await addOrder(u, 'Sigma Corp')
    const advance = async (name: string, times: number) => {
      for (let i = 0; i < times; i++) {
        await u.click(within(orderRow(name)).getByRole('button', { name: new RegExp(`advance ${name}`, 'i') }))
      }
    }
    await advance('Pi Corp', 3)
    await advance('Rho Corp', 3)
    await nav(u, 'Summary')
    expect(screen.getByText(/delivered: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 67%/i)).toBeInTheDocument()
  })

  it('Settings toggles theme and root data-theme changes', async () => {
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

  it('Reset orders clears all orders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Tau Ltd')
    await addOrder(u, 'Upsilon Co')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset orders/i }))
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: /orders \(0\)/i })).toBeInTheDocument()
  })

  it('Summary shows 0% completion after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Phi Inc')
    await u.click(within(orderRow('Phi Inc')).getByRole('button', { name: /advance phi inc/i }))
    await u.click(within(orderRow('Phi Inc')).getByRole('button', { name: /advance phi inc/i }))
    await u.click(within(orderRow('Phi Inc')).getByRole('button', { name: /advance phi inc/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset orders/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total orders: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('order state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Chi Corp')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect(screen.getByText('Chi Corp')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addOrder(u, 'Psi Co')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'packing')
    await nav(u, 'Summary')
    await nav(u, 'Orders')
    expect((screen.getByLabelText(/filter by status/i) as HTMLSelectElement).value).toBe('packing')
  })
})
