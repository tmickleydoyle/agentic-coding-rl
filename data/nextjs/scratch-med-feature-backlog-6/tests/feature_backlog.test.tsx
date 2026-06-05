import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, title: string, priority = 'P1', status = 'idea') {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Priority$/i), priority)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('shows Showing: 0 features initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 features')).toBeInTheDocument()
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

  it('adds a feature and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Dark mode', 'P1', 'idea')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
  })

  it('ignores a blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByText('Showing: 0 features')).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Remove me')
    expect(screen.getByText('Remove me')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 features')).toBeInTheDocument()
  })

  it('filters by P0 priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Critical thing', 'P0', 'idea')
    await addFeature(u, 'Nice to have', 'P2', 'idea')
    await u.click(screen.getByRole('button', { name: 'P0' }))
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    expect(screen.getByText('Critical thing')).toBeInTheDocument()
    expect(screen.queryByText('Nice to have')).not.toBeInTheDocument()
  })

  it('All filter shows all features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature A', 'P0')
    await addFeature(u, 'Feature B', 'P1')
    await addFeature(u, 'Feature C', 'P2')
    await u.click(screen.getByRole('button', { name: 'P0' }))
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 features')).toBeInTheDocument()
  })

  it('updates a feature status in place', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'In progress', 'P1', 'idea')
    await u.selectOptions(screen.getByLabelText(/status for in progress/i), 'building')
    expect(screen.getByLabelText(/status for in progress/i)).toHaveValue('building')
  })

  it('Stats view shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feat1', 'P0', 'shipped')
    await addFeature(u, 'Feat2', 'P1', 'idea')
    await addFeature(u, 'Feat3', 'P2', 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 3')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('Stats completion is 0% with no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats completion calculates correctly with all shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Done A', 'P1', 'shipped')
    await addFeature(u, 'Done B', 'P2', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('Stats completion rounds to nearest percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'one', 'P0', 'shipped')
    await addFeature(u, 'two', 'P1', 'idea')
    await addFeature(u, 'three', 'P2', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Backlog')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all features removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Temp1', 'P0')
    await addFeature(u, 'Temp2', 'P1')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all features/i }))
    await nav(u, 'Backlog')
    expect(screen.getByText('Showing: 0 features')).toBeInTheDocument()
    expect(screen.queryByText('Temp1')).not.toBeInTheDocument()
  })

  it('Clear all features resets Stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'X', 'P0', 'shipped')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all features/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('backlog state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persistent feature', 'P2', 'building')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
  })

  it('status update is reflected in Stats shipped count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Almost done', 'P1', 'building')
    await u.selectOptions(screen.getByLabelText(/status for almost done/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('P2 filter shows only P2 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0')
    await addFeature(u, 'Beta', 'P1')
    await addFeature(u, 'Gamma', 'P2')
    await u.click(screen.getByRole('button', { name: 'P2' }))
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })
})
