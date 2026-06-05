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

describe('Handoff Checklist app', () => {
  it('starts on the Checklist view with seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Update staging env')).toBeInTheDocument()
  })

  it('shows Remaining: 3 initially', () => {
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

  it('navigates back to Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deploy to production')
    expect(screen.getByText('Deploy to production')).toBeInTheDocument()
  })

  it('increments Remaining when a new item is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Another task')
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('toggles an item to done and decrements Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('toggles an item back to not done and increments Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Write README'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('Clear done removes completed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('Clear done with no completed items does not remove anything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('Summary shows correct totals with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects a toggled item (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Record demo video'))
    await u.click(screen.getByLabelText('Update staging env'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary still counts cleared-done items correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists data-theme attribute', async () => {
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

  it('Show only remaining hides done items on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show only remaining/i))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('Show only remaining still counts done items in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Record demo video'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show only remaining/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Notify stakeholders')
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('Remaining count on Checklist matches Remaining in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Update staging env'))
    const checklistRemaining = screen.getByText('Remaining: 2')
    expect(checklistRemaining).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })
})
