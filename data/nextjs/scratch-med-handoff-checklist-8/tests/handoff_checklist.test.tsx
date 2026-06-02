import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Dev Handoff Checklist', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('seeds with three initial items all pending', () => {
    render(<App />)
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Archive repo')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
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

  it('navigates back to Checklist from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Update API docs')
    expect(screen.getByText('Update API docs')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('marks an item done with Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(within(itemRow('Write README')).getByRole('button', { name: /mark undone/i })).toBeInTheDocument()
  })

  it('toggles an item back to undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark undone/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete record demo video/i }))
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('filters to Done shows only done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    expect(screen.queryByText('Archive repo')).not.toBeInTheDocument()
  })

  it('filters to Pending shows only pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Pending')
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Archive repo')).toBeInTheDocument()
  })

  it('filter All shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Archive repo')).toBeInTheDocument()
  })

  it('Remaining count is not affected by the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Summary shows initial seeded data correctly (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary updates after marking items done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Summary shows 0% when there are no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete write readme/i }))
    await u.click(screen.getByRole('button', { name: /delete record demo video/i }))
    await u.click(screen.getByRole('button', { name: /delete archive repo/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('checklist state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Tag release')
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Tag release')).toBeInTheDocument()
    expect(within(itemRow('Write README')).getByRole('button', { name: /mark undone/i })).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })
})
