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

describe('Dev Handoff Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('seeds three initial items', () => {
    render(<App />)
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('shows Remaining: 3 initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /remaining: 3/i })).toBeInTheDocument()
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

  it('navigates back to Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item to the checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Update changelog')
    expect(screen.getByText('Update changelog')).toBeInTheDocument()
  })

  it('ignores a blank new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /remaining: 3/i })).toBeInTheDocument()
  })

  it('decrements Remaining when an item is marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    expect(screen.getByRole('heading', { name: /remaining: 2/i })).toBeInTheDocument()
  })

  it('toggles an item back to undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark undone write readme/i }))
    expect(screen.getByRole('heading', { name: /remaining: 3/i })).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /delete deploy to staging/i }))
    expect(screen.queryByText('Deploy to staging')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /remaining: 2/i })).toBeInTheDocument()
  })

  it('filters to show only Done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
  })

  it('filters to show only Pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write README')).toBeInTheDocument()
    const pendingBtn = screen.getByRole('button', { name: 'Pending' })
    expect(pendingBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('Summary shows correct totals initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects marking items done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary reflects a deleted item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /delete deploy to staging/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /mark done deploy to staging/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('checklist state persists when navigating to Settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Tag release')
    await nav(u, 'Settings')
    await nav(u, 'Checklist')
    expect(screen.getByText('Tag release')).toBeInTheDocument()
  })
})
