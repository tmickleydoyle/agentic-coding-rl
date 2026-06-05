import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Dev Handoff Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('seeds three items on load', () => {
    render(<App />)
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Update README')).toBeInTheDocument()
    expect(screen.getByText('Tag the release')).toBeInTheDocument()
  })

  it('shows Remaining: 3 and Completion: 0% initially', () => {
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

  it('adds a new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deploy to staging')
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('ignores blank item titles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('marks an item done and updates counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('toggles an item back to undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark undone/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Tag the release')).getByRole('button', { name: /delete tag the release/i }))
    expect(screen.queryByText('Tag the release')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('filter Done shows only done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Update README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Update README')).toBeInTheDocument()
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
  })

  it('filter Remaining shows only undone items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Tag the release')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Remaining')
    expect(screen.queryByText('Tag the release')).not.toBeInTheDocument()
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
  })

  it('counts are always visible regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Update README')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary shows 0% and 0 done when nothing is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all items removes everything (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary shows zeros after clearing all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Tag the release')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Settings')
    await nav(u, 'Checklist')
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(within(itemRow('Tag the release')).getByRole('button', { name: /mark undone/i })).toBeInTheDocument()
  })
})
