import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, title: string) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

function featureRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view with zero features', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('adds a feature and shows it with default P1 / idea', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Dark mode')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    const row = featureRow('Dark mode')
    expect(within(row).getByLabelText(/priority for dark mode/i)).toHaveValue('P1')
    expect(within(row).getByLabelText(/status for dark mode/i)).toHaveValue('idea')
  })

  it('ignores a blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'To Delete')
    await u.click(screen.getByRole('button', { name: /delete to delete/i }))
    expect(screen.queryByText('To Delete')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('changes priority of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Auth flow')
    await u.selectOptions(within(featureRow('Auth flow')).getByLabelText(/priority for auth flow/i), 'P0')
    expect(within(featureRow('Auth flow')).getByLabelText(/priority for auth flow/i)).toHaveValue('P0')
  })

  it('changes status of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'CSV export')
    await u.selectOptions(within(featureRow('CSV export')).getByLabelText(/status for csv export/i), 'building')
    expect(within(featureRow('CSV export')).getByLabelText(/status for csv export/i)).toHaveValue('building')
  })

  it('filters by priority P0 hides non-P0 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Urgent feature')
    await u.selectOptions(within(featureRow('Urgent feature')).getByLabelText(/priority for urgent feature/i), 'P0')
    await addFeature(u, 'Nice to have')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    expect(screen.getByText('Urgent feature')).toBeInTheDocument()
    expect(screen.queryByText('Nice to have')).not.toBeInTheDocument()
  })

  it('filter All shows all features again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature A')
    await addFeature(u, 'Feature B')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
  })

  it('Stats shows zeros when there are no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added features (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'One')
    await addFeature(u, 'Two')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('P1: 2')).toBeInTheDocument()
    expect(screen.getByText('Idea: 2')).toBeInTheDocument()
  })

  it('Stats counts shipped rate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha')
    await addFeature(u, 'Beta')
    await addFeature(u, 'Gamma')
    await addFeature(u, 'Delta')
    await u.selectOptions(within(featureRow('Alpha')).getByLabelText(/status for alpha/i), 'shipped')
    await u.selectOptions(within(featureRow('Beta')).getByLabelText(/status for beta/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 50%')).toBeInTheDocument()
  })

  it('Stats counts by priority across all features ignoring filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'P0 feature')
    await u.selectOptions(within(featureRow('P0 feature')).getByLabelText(/priority for p0 feature/i), 'P0')
    await addFeature(u, 'P2 feature')
    await u.selectOptions(within(featureRow('P2 feature')).getByLabelText(/priority for p2 feature/i), 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
  })

  it('Stats shows Building count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'WIP')
    await u.selectOptions(within(featureRow('WIP')).getByLabelText(/status for wip/i), 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Idea: 0')).toBeInTheDocument()
  })

  it('persists state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persisted')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
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

  it('filter persists state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })
})
