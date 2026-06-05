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

describe('Handoff Checklist app', () => {
  it('starts on the Checklist view with seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
    expect(screen.getByText('Write documentation')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Hand off credentials')).toBeInTheDocument()
  })

  it('shows correct initial Remaining and Completion', () => {
    render(<App />)
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
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

  it('adds a new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Update README')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Update README')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('marks an item done and updates Remaining and Completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('marks an item undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark undone write documentation/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('removes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /remove record demo video/i }))
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('completion is 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /mark done hand off credentials/i }))
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary reflects seeded items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary updates after marking items done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary counts removed items correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /remove hand off credentials/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('hides done items when Show done items is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write documentation')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('done items still count in Summary when hidden in Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('Remaining and Completion on Checklist still reflect all items when some are hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Checklist')
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Deploy to staging')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })
})
