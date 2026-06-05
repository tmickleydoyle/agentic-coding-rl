import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.clear(screen.getByLabelText(/reviewer name/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.type(screen.getByLabelText(/reviewer name/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review (held-out)', () => {
  it('filter by Changes shows only changes items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Needs work', 'Alice')
    await addItem(u, 'Looks good', 'Bob')
    await u.click(within(itemRow('Needs work')).getByRole('button', { name: /set changes/i }))
    await u.click(within(itemRow('Looks good')).getByRole('button', { name: /set approved/i }))
    await u.click(screen.getByRole('button', { name: 'Changes' }))
    expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
    expect(screen.getByText('Needs work')).toBeInTheDocument()
    expect(screen.queryByText('Looks good')).not.toBeInTheDocument()
  })

  it('Stats approved percentage rounds correctly for three items one approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P', 'Alice')
    await addItem(u, 'Q', 'Bob')
    await addItem(u, 'R', 'Carol')
    await u.click(within(itemRow('P')).getByRole('button', { name: /set approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Approved: 33%')).toBeInTheDocument()
  })

  it('filter count updates when status changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Flip me', 'Dave')
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing 0 items')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    await u.click(within(itemRow('Flip me')).getByRole('button', { name: /set approved/i }))
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
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

  it('multiple items can have different statuses independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Alice')
    await addItem(u, 'Beta', 'Bob')
    await addItem(u, 'Gamma', 'Carol')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /set approved/i }))
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /set changes/i }))
    expect(within(itemRow('Alpha')).getByText('approved')).toBeInTheDocument()
    expect(within(itemRow('Beta')).getByText('changes')).toBeInTheDocument()
    expect(within(itemRow('Gamma')).getByText('draft')).toBeInTheDocument()
  })

  it('Stats shows all three status counts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'D1', 'Alice')
    await addItem(u, 'A1', 'Bob')
    await addItem(u, 'C1', 'Carol')
    await addItem(u, 'A2', 'Dave')
    await u.click(within(itemRow('A1')).getByRole('button', { name: /set approved/i }))
    await u.click(within(itemRow('C1')).getByRole('button', { name: /set changes/i }))
    await u.click(within(itemRow('A2')).getByRole('button', { name: /set approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 2')).toBeInTheDocument()
    expect(screen.getByText('Changes: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 50%')).toBeInTheDocument()
  })

  it('Stats is unaffected by active filter on Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Filtered out', 'Alice')
    await addItem(u, 'Also filtered', 'Bob')
    await u.click(within(itemRow('Filtered out')).getByRole('button', { name: /set approved/i }))
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    // Reviews shows 1 but Stats should count all 2
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('clearing all then adding new item starts fresh', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old item', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Reviews')
    await addItem(u, 'New item', 'Bob')
    expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
    expect(screen.getByText('New item')).toBeInTheDocument()
    expect(screen.queryByText('Old item')).not.toBeInTheDocument()
  })
})
