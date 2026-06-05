import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Feature Backlog app', () => {
  it('starts on the Backlog view with seeded features', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /features \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('User authentication')).toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByText('CSV export')).toBeInTheDocument()
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

  it('navigates back to Backlog from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByRole('heading', { name: /features/i })).toBeInTheDocument()
  })

  it('adds a new feature with default P1/idea', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/feature title/i), 'API rate limiting')
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByText('API rate limiting')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /features \(4\)/i })).toBeInTheDocument()
    const prioritySelect = screen.getByLabelText('Priority for API rate limiting')
    expect((prioritySelect as HTMLSelectElement).value).toBe('P1')
    const statusSelect = screen.getByLabelText('Status for API rate limiting')
    expect((statusSelect as HTMLSelectElement).value).toBe('idea')
  })

  it('ignores a blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByRole('heading', { name: /features \(3\)/i })).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete dark mode/i }))
    expect(screen.queryByText('Dark mode')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /features \(2\)/i })).toBeInTheDocument()
  })

  it('updates priority of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    const sel = screen.getByLabelText('Priority for Dark mode')
    await u.selectOptions(sel, 'P0')
    expect((sel as HTMLSelectElement).value).toBe('P0')
  })

  it('updates status of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    const sel = screen.getByLabelText('Status for Dark mode')
    await u.selectOptions(sel, 'shipped')
    expect((sel as HTMLSelectElement).value).toBe('shipped')
  })

  it('filters by priority P0 shows only matching features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('User authentication')).toBeInTheDocument()
    expect(screen.queryByText('Dark mode')).not.toBeInTheDocument()
    expect(screen.queryByText('CSV export')).not.toBeInTheDocument()
  })

  it('filters by status shipped shows only matching features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('CSV export')).toBeInTheDocument()
    expect(screen.queryByText('User authentication')).not.toBeInTheDocument()
  })

  it('combined priority and status filters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'idea')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('combined filters with no match shows Features (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
  })

  it('resetting filter to All shows all features again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByRole('heading', { name: /features \(3\)/i })).toBeInTheDocument()
  })

  it('Stats shows seeded data totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
    expect(screen.getByText('Idea: 1')).toBeInTheDocument()
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 33%')).toBeInTheDocument()
  })

  it('Stats updates after adding a feature (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/feature title/i), 'Notifications')
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('P1: 2')).toBeInTheDocument()
  })

  it('Stats shipped rate is 0% when no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete user authentication/i }))
    await u.click(screen.getByRole('button', { name: /delete dark mode/i }))
    await u.click(screen.getByRole('button', { name: /delete csv export/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects deleted feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete csv export/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects status change (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Dark mode'), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 67%')).toBeInTheDocument()
  })

  it('toggles theme and data-theme attribute persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Backlog')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filters persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect((screen.getByLabelText(/filter by priority/i) as HTMLSelectElement).value).toBe('P1')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
  })
})
