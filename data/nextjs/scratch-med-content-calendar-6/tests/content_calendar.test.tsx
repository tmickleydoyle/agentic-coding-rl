import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(
  u: U,
  title: string,
  platform = 'Twitter',
  status = 'Draft'
) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Calendar app', () => {
  it('starts on the Calendar view with empty list', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /content items \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Calendar view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    expect(screen.getByRole('heading', { name: /content items/i })).toBeInTheDocument()
  })

  it('adds a content item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch post', 'LinkedIn', 'Scheduled')
    expect(screen.getByText('Launch post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content items \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /content items \(0\)/i })).toBeInTheDocument()
  })

  it('shows platform and status for each item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog article', 'Blog', 'Draft')
    const row = itemRow('Blog article')
    expect(within(row).getByText('Blog')).toBeInTheDocument()
    expect(within(row).getByText('Draft')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp post')
    await u.click(screen.getByRole('button', { name: /delete temp post/i }))
    expect(screen.queryByText('Temp post')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content items \(0\)/i })).toBeInTheDocument()
  })

  it('marks an item as Published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Promo tweet', 'Twitter', 'Draft')
    await u.click(screen.getByRole('button', { name: /mark promo tweet published/i }))
    expect(within(itemRow('Promo tweet')).getByText('Published')).toBeInTheDocument()
  })

  it('Mark Published button is disabled when already Published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Already live', 'Instagram', 'Published')
    expect(
      screen.getByRole('button', { name: /mark already live published/i })
    ).toBeDisabled()
  })

  it('filters items by Scheduled status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft post', 'Blog', 'Draft')
    await addItem(u, 'Sched post', 'Twitter', 'Scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Scheduled')
    expect(screen.queryByText('Draft post')).not.toBeInTheDocument()
    expect(screen.getByText('Sched post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content items \(1\)/i })).toBeInTheDocument()
  })

  it('filter All shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item A', 'Blog', 'Draft')
    await addItem(u, 'Item B', 'Twitter', 'Published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: /content items \(2\)/i })).toBeInTheDocument()
  })

  it('stats show correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post 1', 'Twitter', 'Draft')
    await addItem(u, 'Post 2', 'Instagram', 'Scheduled')
    await addItem(u, 'Post 3', 'LinkedIn', 'Published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('scheduled rate is computed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'S1', 'Twitter', 'Scheduled')
    await addItem(u, 'S2', 'Blog', 'Scheduled')
    await addItem(u, 'D1', 'Instagram', 'Draft')
    await addItem(u, 'D2', 'LinkedIn', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 50%')).toBeInTheDocument()
  })

  it('scheduled rate is 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('stats count items hidden by filter (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Hidden draft', 'Blog', 'Draft')
    await addItem(u, 'Visible sched', 'Twitter', 'Scheduled')
    // filter to Scheduled — Draft is hidden in Calendar
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Scheduled')
    expect(screen.getByRole('heading', { name: /content items \(1\)/i })).toBeInTheDocument()
    // Stats should still see both items
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('mark published updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Promo', 'Instagram', 'Draft')
    await u.click(screen.getByRole('button', { name: /mark promo published/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('toggles the theme and persists it across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Calendar')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves items when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item', 'LinkedIn', 'Scheduled')
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })

  it('adding multiple items updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'First', 'Twitter', 'Draft')
    await addItem(u, 'Second', 'Blog', 'Scheduled')
    await addItem(u, 'Third', 'Instagram', 'Published')
    expect(screen.getByRole('heading', { name: /content items \(3\)/i })).toBeInTheDocument()
  })
})
