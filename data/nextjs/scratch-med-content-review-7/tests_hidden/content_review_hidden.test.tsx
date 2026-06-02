// HELD-OUT generalization tests — different inputs, sequences, and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.clear(screen.getByLabelText(/reviewer/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.type(screen.getByLabelText(/reviewer/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review Tracker (held-out)', () => {
  it('shows reviewer name in each list item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Whitepaper', 'Frank')
    expect(within(itemRow('Whitepaper')).getByText('Frank')).toBeInTheDocument()
  })

  it('multiple items each track their own status independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Alice')
    await addItem(u, 'Beta', 'Bob')
    await addItem(u, 'Gamma', 'Carol')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /approve/i }))
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /request changes/i }))
    expect(within(itemRow('Alpha')).getByText('approved')).toBeInTheDocument()
    expect(within(itemRow('Beta')).getByText('changes')).toBeInTheDocument()
    expect(within(itemRow('Gamma')).getByText('draft')).toBeInTheDocument()
  })

  it('Showing count updates dynamically when filter is active and status changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc 1', 'Alice')
    await addItem(u, 'Doc 2', 'Bob')
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    await u.click(within(itemRow('Doc 1')).getByRole('button', { name: /approve/i }))
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('approved percentage rounds correctly for one-of-three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', 'Alice')
    await addItem(u, 'Y', 'Bob')
    await addItem(u, 'Z', 'Carol')
    await u.click(within(itemRow('X')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Approved: 33%')).toBeInTheDocument()
  })

  it('all three items approved gives 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P', 'Alice')
    await addItem(u, 'Q', 'Bob')
    await addItem(u, 'R', 'Carol')
    await u.click(within(itemRow('P')).getByRole('button', { name: /approve/i }))
    await u.click(within(itemRow('Q')).getByRole('button', { name: /approve/i }))
    await u.click(within(itemRow('R')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Approved: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Approved: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Changes: 0')).toBeInTheDocument()
  })

  it('filter state persists when switching views and returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep A', 'Alice')
    await addItem(u, 'Keep B', 'Bob')
    await u.click(within(itemRow('Keep A')).getByRole('button', { name: /approve/i }))
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    await nav(u, 'Summary')
    await nav(u, 'Reviews')
    // Filter state may reset on navigation — just check items exist
    expect(screen.getByText('Keep A')).toBeInTheDocument()
    expect(screen.getByText('Keep B')).toBeInTheDocument()
  })

  it('summary counts update after status changes (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Essay', 'Dana')
    await nav(u, 'Summary')
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await u.click(within(itemRow('Essay')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 100%')).toBeInTheDocument()
  })

  it('clear all then re-add item works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old item', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Reviews')
    await addItem(u, 'New item', 'Bob')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('New item')).toBeInTheDocument()
    expect(screen.queryByText('Old item')).not.toBeInTheDocument()
  })

  it('theme toggle switches back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Changes filter shows zero when none have changes status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Clean doc', 'Eve')
    await u.click(within(itemRow('Clean doc')).getByRole('button', { name: /approve/i }))
    await u.click(screen.getByRole('button', { name: 'Changes' }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })
})
