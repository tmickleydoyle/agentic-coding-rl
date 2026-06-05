import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Dev Handoff Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('shows the three seed items on load', () => {
    render(<App />)
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(screen.getByText('Update README')).toBeInTheDocument()
    expect(screen.getByText('Tag release')).toBeInTheDocument()
  })

  it('shows Remaining: 3 with all seed items undone', () => {
    render(<App />)
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

  it('navigates back to Checklist after visiting other views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item to the checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Deploy to staging')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('decrements Remaining when an item is checked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('increments Remaining when a done item is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('hides done items when Hide done is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Tag release'))
    await u.click(screen.getByLabelText(/hide done/i))
    expect(screen.queryByText('Tag release')).not.toBeInTheDocument()
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('restores hidden done items when Hide done is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Update README'))
    await u.click(screen.getByLabelText(/hide done/i))
    await u.click(screen.getByLabelText(/hide done/i))
    expect(screen.getByText('Update README')).toBeInTheDocument()
  })

  it('Summary shows correct totals with seed data (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects a toggled item (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await u.click(screen.getByLabelText('Done: Update README'))
    await u.click(screen.getByLabelText('Done: Tag release'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary counts hidden done items (Hide done does not affect Summary)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Tag release'))
    await u.click(screen.getByLabelText(/hide done/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset checklist clears all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write unit tests')).not.toBeInTheDocument()
    expect(screen.queryByText('Update README')).not.toBeInTheDocument()
    expect(screen.queryByText('Tag release')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary shows 0% after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('preserves checklist state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Handoff docs')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Handoff docs')).toBeInTheDocument()
  })

  it('new item also appears in Summary total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Extra task')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })
})
