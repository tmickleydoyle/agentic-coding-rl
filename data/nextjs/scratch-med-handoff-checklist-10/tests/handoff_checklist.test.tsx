import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Dev Handoff Checklist app', () => {
  it('starts on the Checklist view with seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Hand off credentials')).toBeInTheDocument()
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

  it('updates Remaining count after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Send handoff email')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('toggles an item to done and decrements Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('untoggling a done item increments Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Write README done'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('clears done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('Summary shows correct totals with seeded data (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects toggled items (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Record demo video done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Record demo video done'))
    await u.click(screen.getByLabelText('Mark Hand off credentials done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary reflects a new item added on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Update Jira tickets')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Checklist')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('hiding done items does not show completed items on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('done items still counted in Summary when hidden on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Hand off credentials done'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Persistent task')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })
})
