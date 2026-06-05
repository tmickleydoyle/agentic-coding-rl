import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Handoff Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('shows the three seeded items on load', () => {
    render(<App />)
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Update API docs')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('shows Remaining: 3 and Completion: 0% on load', () => {
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

  it('navigates back to Checklist view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item and updates Remaining count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Deploy to staging')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('ignores blank item titles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('toggling an item as done updates Remaining and Completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('toggling an item back to not done restores count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    await u.click(screen.getByLabelText('Done: Write README'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('removes an item and updates counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Update API docs')).getByRole('button', { name: /remove update api docs/i }))
    expect(screen.queryByText('Update API docs')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('completing all items shows Completion: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    await u.click(screen.getByLabelText('Done: Update API docs'))
    await u.click(screen.getByLabelText('Done: Record demo video'))
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Summary view reflects seeded data (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary view updates after marking an item done (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    await u.click(screen.getByLabelText('Done: Update API docs'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Clear completed in Settings removes done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear completed/i }))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Update API docs')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Clear completed with nothing done changes nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear completed/i }))
    await nav(u, 'Checklist')
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('Toggle theme switches data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('checklist state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Tag release')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Tag release')).toBeInTheDocument()
  })

  it('Summary shows 0% when no items exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /remove write readme/i }))
    await u.click(within(itemRow('Update API docs')).getByRole('button', { name: /remove update api docs/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /remove record demo video/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })
})
