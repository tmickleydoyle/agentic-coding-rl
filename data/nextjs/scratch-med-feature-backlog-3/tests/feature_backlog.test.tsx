import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, title: string, priority?: string) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  if (priority) {
    await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  }
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
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

  it('navigates back to Backlog', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('adds a feature and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Dark mode', 'P1')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('ignores blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByText('P0 (0)')).toBeInTheDocument()
    expect(screen.getByText('P1 (0)')).toBeInTheDocument()
    expect(screen.getByText('P2 (0)')).toBeInTheDocument()
  })

  it('shows correct priority counts after adding features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature A', 'P0')
    await addFeature(u, 'Feature B', 'P1')
    await addFeature(u, 'Feature C', 'P1')
    expect(screen.getByText('P0 (1)')).toBeInTheDocument()
    expect(screen.getByText('P1 (2)')).toBeInTheDocument()
    expect(screen.getByText('P2 (0)')).toBeInTheDocument()
  })

  it('new feature defaults to idea status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'New thing', 'P2')
    const statusSelect = screen.getByLabelText(/status of new thing/i)
    expect((statusSelect as HTMLSelectElement).value).toBe('idea')
  })

  it('can change feature status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Work item', 'P0')
    await u.selectOptions(screen.getByLabelText(/status of work item/i), 'building')
    expect((screen.getByLabelText(/status of work item/i) as HTMLSelectElement).value).toBe('building')
  })

  it('filter by priority shows only matching features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0')
    await addFeature(u, 'Beta', 'P1')
    await addFeature(u, 'Gamma', 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })

  it('filter All shows all features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0')
    await addFeature(u, 'Beta', 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('priority counts are not affected by filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'One', 'P0')
    await addFeature(u, 'Two', 'P1')
    await addFeature(u, 'Three', 'P1')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByText('P1 (2)')).toBeInTheDocument()
  })

  it('stats view shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feat 1', 'P0')
    await addFeature(u, 'Feat 2', 'P1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 2')).toBeInTheDocument()
    expect(screen.getByText('Idea: 2')).toBeInTheDocument()
  })

  it('stats view shows 0% shipped when no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 0%')).toBeInTheDocument()
  })

  it('stats view reflects status changes (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Ship me', 'P0')
    await addFeature(u, 'Not yet', 'P1')
    await u.selectOptions(screen.getByLabelText(/status of ship me/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Idea: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 50%')).toBeInTheDocument()
  })

  it('stats building count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'WIP', 'P0')
    await u.selectOptions(screen.getByLabelText(/status of WIP/i), 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Idea: 0')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
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
    await nav(u, 'Backlog')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('feature list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persistent feature', 'P2')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
  })

  it('status change persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Track me', 'P1')
    await u.selectOptions(screen.getByLabelText(/status of track me/i), 'building')
    await nav(u, 'Settings')
    await nav(u, 'Backlog')
    expect((screen.getByLabelText(/status of track me/i) as HTMLSelectElement).value).toBe('building')
  })
})
