// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due: string) {
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('shows the due date in each row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft contract', '2025-03-15')
    expect(within(itemRow('Draft contract')).getByText('2025-03-15')).toBeInTheDocument()
  })

  it('Showing count updates correctly after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'AAA', '2025-01-01')
    await addItem(u, 'BBB', '2025-01-02')
    await u.click(within(itemRow('AAA')).getByRole('button', { name: /delete aaa/i }))
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('Pending filter count updates after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Step 1', '2025-02-01')
    await addItem(u, 'Step 2', '2025-02-02')
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
    await u.click(within(itemRow('Step 1')).getByRole('button', { name: /mark delivered step 1/i }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
  })

  it('Delivered filter is empty when nothing is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Lone item', '2025-05-05')
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Showing: 0 of 1')).toBeInTheDocument()
    expect(screen.queryByText('Lone item')).not.toBeInTheDocument()
  })

  it('Summary delivery rate rounds to nearest integer for non-round values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'R1', '2025-01-01')
    await addItem(u, 'R2', '2025-01-02')
    await addItem(u, 'R3', '2025-01-03')
    await u.click(within(itemRow('R1')).getByRole('button', { name: /mark delivered r1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 33%')).toBeInTheDocument()
  })

  it('Summary updates after marking all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done1', '2025-04-01')
    await addItem(u, 'Done2', '2025-04-02')
    await u.click(within(itemRow('Done1')).getByRole('button', { name: /mark delivered done1/i }))
    await u.click(within(itemRow('Done2')).getByRole('button', { name: /mark delivered done2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 100%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter state resets do not affect cross-view delivery state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Crosscheck', '2025-06-01')
    await u.click(within(itemRow('Crosscheck')).getByRole('button', { name: /mark delivered crosscheck/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('multiple items can be added and each shows pending initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'M1', '2025-01-01')
    await addItem(u, 'M2', '2025-01-02')
    await addItem(u, 'M3', '2025-01-03')
    expect(within(itemRow('M1')).getByText('pending')).toBeInTheDocument()
    expect(within(itemRow('M2')).getByText('pending')).toBeInTheDocument()
    expect(within(itemRow('M3')).getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('Reset all also clears Summary totals to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wipe me', '2025-07-01')
    await u.click(within(itemRow('Wipe me')).getByRole('button', { name: /mark delivered wipe me/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all deliverables/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 0%')).toBeInTheDocument()
  })
})
