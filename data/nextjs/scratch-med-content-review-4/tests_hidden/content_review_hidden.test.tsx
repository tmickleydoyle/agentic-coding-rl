// HELD-OUT generalization tests — fresh scenarios and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.clear(screen.getByLabelText(/reviewer/i))
  await u.type(screen.getByLabelText(/reviewer/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review Tracker (held-out)', () => {
  it('multiple items each show their own reviewer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Article One', 'Zoe')
    await addItem(u, 'Article Two', 'Yara')
    expect(within(itemRow('Article One')).getByText('Zoe')).toBeInTheDocument()
    expect(within(itemRow('Article Two')).getByText('Yara')).toBeInTheDocument()
  })

  it('filter by changes shows only items with changes status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Needs work', 'Alice')
    await addItem(u, 'Good to go', 'Bob')
    await u.click(within(itemRow('Needs work')).getByRole('button', { name: 'Request changes' }))
    await u.click(within(itemRow('Good to go')).getByRole('button', { name: 'Approve' }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'changes')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Needs work')).toBeInTheDocument()
    expect(screen.queryByText('Good to go')).not.toBeInTheDocument()
  })

  it('Stats changes requested count updates after request changes action', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Rev A', 'Alice')
    await addItem(u, 'Rev B', 'Bob')
    await u.click(within(itemRow('Rev A')).getByRole('button', { name: 'Request changes' }))
    await u.click(within(itemRow('Rev B')).getByRole('button', { name: 'Request changes' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Changes requested: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('approved % is 100% when all items approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Full A', 'Alice')
    await addItem(u, 'Full B', 'Bob')
    await u.click(within(itemRow('Full A')).getByRole('button', { name: 'Approve' }))
    await u.click(within(itemRow('Full B')).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved %: 100%')).toBeInTheDocument()
  })

  it('resetting draft after approve updates stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Cycle doc', 'Carol')
    await u.click(within(itemRow('Cycle doc')).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await u.click(within(itemRow('Cycle doc')).getByRole('button', { name: 'Reset to draft' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 0%')).toBeInTheDocument()
  })

  it('Showing count with filter changes remains correct after status update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Watch A', 'Dave')
    await addItem(u, 'Watch B', 'Eve')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
    await u.click(within(itemRow('Watch A')).getByRole('button', { name: 'Approve' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme in label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('reset all and then re-add works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old item', 'Fred')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Reviews')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    await addItem(u, 'New item', 'Grace')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('New item')).toBeInTheDocument()
  })

  it('Stats draft count decreases when item is approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft one', 'Hank')
    await addItem(u, 'Draft two', 'Iris')
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await u.click(within(itemRow('Draft one')).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
  })
})
