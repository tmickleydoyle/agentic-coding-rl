import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(
  u: U,
  title: string,
  priority: string = 'P0',
  status: string = 'idea',
) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Priority$/i), priority)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view with zero features', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Backlog view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
  })

  it('adds a feature and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Dark mode', 'P1', 'idea')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('ignores a blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
  })

  it('shows priority and status on each feature row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Export CSV', 'P2', 'building')
    const item = screen.getByText('Export CSV').closest('li') as HTMLElement
    expect(within(item).getByText('P2')).toBeInTheDocument()
    expect(within(item).getByText('building')).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'To delete')
    expect(screen.getByText('To delete')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete to delete/i }))
    expect(screen.queryByText('To delete')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
  })

  it('filters by P0 hides non-P0 features and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Critical fix', 'P0', 'idea')
    await addFeature(u, 'Nice to have', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Critical fix')).toBeInTheDocument()
    expect(screen.queryByText('Nice to have')).not.toBeInTheDocument()
  })

  it('filter All shows all features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0', 'idea')
    await addFeature(u, 'Beta', 'P1', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByRole('heading', { name: /features \(2\)/i })).toBeInTheDocument()
  })

  it('stats shows zero total and 0% completion when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('stats reflects added features (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature A', 'P0', 'shipped')
    await addFeature(u, 'Feature B', 'P1', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/p0: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/p1: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
  })

  it('stats counts all features regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'X', 'P0', 'shipped')
    await addFeature(u, 'Y', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/p2: 1/i)).toBeInTheDocument()
  })

  it('stats completion rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'one', 'P0', 'shipped')
    await addFeature(u, 'two', 'P1', 'idea')
    await addFeature(u, 'three', 'P2', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Backlog')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('features persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persistent feature', 'P1', 'building')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
  })

  it('adding multiple features increments heading count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'F1', 'P0', 'idea')
    await addFeature(u, 'F2', 'P1', 'building')
    await addFeature(u, 'F3', 'P2', 'shipped')
    expect(screen.getByRole('heading', { name: /features \(3\)/i })).toBeInTheDocument()
  })

  it('deleting one of multiple features updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep me', 'P1', 'idea')
    await addFeature(u, 'Remove me', 'P0', 'idea')
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByText('Keep me')).toBeInTheDocument()
  })
})
