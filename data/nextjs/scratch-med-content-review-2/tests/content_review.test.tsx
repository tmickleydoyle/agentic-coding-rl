import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.clear(screen.getByLabelText(/reviewer name/i))
  await u.type(screen.getByLabelText(/reviewer name/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review app', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows seeded items on load', () => {
    render(<App />)
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Blog post')).toBeInTheDocument()
    expect(screen.getByText('Landing page')).toBeInTheDocument()
  })

  it('shows Items (3) heading for the seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('adds a new item with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'New article', 'Carol')
    expect(screen.getByText('New article')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (4)' })).toBeInTheDocument()
  })

  it('ignores add when item title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/reviewer name/i), 'Carol')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('ignores add when reviewer name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item title/i), 'Some title')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('status buttons: current status is disabled', () => {
    render(<App />)
    const row = itemRow('Homepage copy')
    expect(within(row).getByRole('button', { name: /set homepage copy to approved/i })).toBeDisabled()
    expect(within(row).getByRole('button', { name: /set homepage copy to draft/i })).not.toBeDisabled()
  })

  it('changes status of an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Blog post')
    await u.click(within(row).getByRole('button', { name: /set blog post to approved/i }))
    expect(within(itemRow('Blog post')).getByRole('button', { name: /set blog post to approved/i })).toBeDisabled()
  })

  it('filter by Draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Blog post')).toBeInTheDocument()
    expect(screen.queryByText('Homepage copy')).not.toBeInTheDocument()
  })

  it('filter by Approved shows only approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
  })

  it('filter by Changes shows only changes items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'changes')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Landing page')).toBeInTheDocument()
  })

  it('filter All restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('stats view shows seeded data totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes: 1')).toBeInTheDocument()
  })

  it('stats view shows approved count and percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 33%')).toBeInTheDocument()
  })

  it('stats reflect a status change cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Blog post')).getByRole('button', { name: /set blog post to approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 67%')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('stats show 0% when no items approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /set homepage copy to draft/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('added item appears in Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Press release', 'Dave')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await nav(u, 'Reviews')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state resets do not affect underlying data shown in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })
})
