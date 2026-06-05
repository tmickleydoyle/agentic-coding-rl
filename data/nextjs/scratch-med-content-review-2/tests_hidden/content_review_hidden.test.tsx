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

describe('Content Review (held-out)', () => {
  it('seeded items have correct reviewer names visible', () => {
    render(<App />)
    const homepageRow = itemRow('Homepage copy')
    expect(within(homepageRow).getByText('Alice')).toBeInTheDocument()
    const blogRow = itemRow('Blog post')
    expect(within(blogRow).getByText('Bob')).toBeInTheDocument()
  })

  it('adding two items increases count to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Video script', 'Eve')
    await addItem(u, 'Podcast notes', 'Frank')
    expect(screen.getByRole('heading', { name: 'Items (5)' })).toBeInTheDocument()
  })

  it('new item starts as draft with Draft button disabled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Newsletter', 'Grace')
    const row = itemRow('Newsletter')
    expect(within(row).getByRole('button', { name: /set newsletter to draft/i })).toBeDisabled()
    expect(within(row).getByRole('button', { name: /set newsletter to approved/i })).not.toBeDisabled()
  })

  it('status change persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Landing page')).getByRole('button', { name: /set landing page to approved/i }))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(within(itemRow('Landing page')).getByRole('button', { name: /set landing page to approved/i })).toBeDisabled()
  })

  it('filter by Changes then add item does not show new draft in filtered view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'changes')
    await addItem(u, 'FAQ page', 'Hank')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.queryByText('FAQ page')).not.toBeInTheDocument()
  })

  it('switching new item to approved then checking stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Product page', 'Iris')
    await u.click(within(itemRow('Product page')).getByRole('button', { name: /set product page to approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Approved: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 50%')).toBeInTheDocument()
  })

  it('stats show 100% when all items approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Blog post')).getByRole('button', { name: /set blog post to approved/i }))
    await u.click(within(itemRow('Landing page')).getByRole('button', { name: /set landing page to approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 100%')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Changes: 0')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('filter All after filtering by Draft shows all 3 seeded items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Blog post')).toBeInTheDocument()
    expect(screen.getByText('Landing page')).toBeInTheDocument()
  })

  it('changes status button becomes disabled after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /set homepage copy to changes/i }))
    expect(within(itemRow('Homepage copy')).getByRole('button', { name: /set homepage copy to changes/i })).toBeDisabled()
    expect(within(itemRow('Homepage copy')).getByRole('button', { name: /set homepage copy to approved/i })).not.toBeDisabled()
  })
})
