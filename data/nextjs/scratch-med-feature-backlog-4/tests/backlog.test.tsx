import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function featureRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

async function addFeature(u: U, title: string, priority = 'P0') {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('renders the three seed features on load', () => {
    render(<App />)
    expect(screen.getByText('OAuth login')).toBeInTheDocument()
    expect(screen.getByText('CSV export')).toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('shows correct initial Showing count with seed data', () => {
    render(<App />)
    expect(screen.getByText('Showing 3 of 3 features')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('adds a new feature with P1 priority defaulting to idea status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Webhook support', 'P1')
    const row = featureRow('Webhook support')
    expect(within(row).getByText('P1')).toBeInTheDocument()
    expect(within(row).getByText('idea')).toBeInTheDocument()
    expect(screen.getByText('Showing 4 of 4 features')).toBeInTheDocument()
  })

  it('ignores blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByText('Showing 3 of 3 features')).toBeInTheDocument()
  })

  it('advances a feature status idea -> building', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = featureRow('OAuth login')
    expect(within(row).getByText('idea')).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /advance oauth login/i }))
    expect(within(featureRow('OAuth login')).getByText('building')).toBeInTheDocument()
  })

  it('advances a feature status building -> shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = featureRow('CSV export')
    expect(within(row).getByText('building')).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /advance csv export/i }))
    expect(within(featureRow('CSV export')).getByText('shipped')).toBeInTheDocument()
  })

  it('Advance button is disabled when status is shipped', () => {
    render(<App />)
    const row = featureRow('Dark mode')
    expect(within(row).getByRole('button', { name: /advance dark mode/i })).toBeDisabled()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('CSV export')).getByRole('button', { name: /delete csv export/i }))
    expect(screen.queryByText('CSV export')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 2 features')).toBeInTheDocument()
  })

  it('filters by P0 priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByText('Showing 1 of 3 features')).toBeInTheDocument()
    expect(screen.getByText('OAuth login')).toBeInTheDocument()
    expect(screen.queryByText('CSV export')).not.toBeInTheDocument()
  })

  it('filter does not affect total count in Showing text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'SSO', 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByText('Showing 2 of 4 features')).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing 3 of 3 features')).toBeInTheDocument()
  })

  it('Stats shows correct seed totals', async () => {
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
  })

  it('Stats shows shipped percentage with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 33%')).toBeInTheDocument()
  })

  it('Stats updates after advancing a feature (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 67%')).toBeInTheDocument()
  })

  it('Stats shows 0% when no features exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /delete oauth login/i }))
    await u.click(within(featureRow('CSV export')).getByRole('button', { name: /delete csv export/i }))
    await u.click(within(featureRow('Dark mode')).getByRole('button', { name: /delete dark mode/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0%')).toBeInTheDocument()
  })

  it('theme toggles via Settings and persists across views', async () => {
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

  it('backlog state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persistent feature', 'P2')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
  })
})
