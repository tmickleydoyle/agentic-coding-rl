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
  it('starts on the Backlog view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('shows Showing: 0 of 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
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
    await addFeature(u, 'Dark mode')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('ignores blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('new features default to P1 priority and idea status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Export CSV')
    const row = featureRow('Export CSV')
    expect(within(row).getByLabelText(/Priority for Export CSV/i)).toHaveValue('P1')
    expect(within(row).getByLabelText(/Status for Export CSV/i)).toHaveValue('idea')
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'To be deleted')
    await u.click(screen.getByRole('button', { name: /delete to be deleted/i }))
    expect(screen.queryByText('To be deleted')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('updates priority of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High priority item')
    const row = featureRow('High priority item')
    await u.selectOptions(within(row).getByLabelText(/Priority for High priority item/i), 'P0')
    expect(within(row).getByLabelText(/Priority for High priority item/i)).toHaveValue('P0')
  })

  it('updates status of a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'In progress feature')
    const row = featureRow('In progress feature')
    await u.selectOptions(within(row).getByLabelText(/Status for In progress feature/i), 'building')
    expect(within(row).getByLabelText(/Status for In progress feature/i)).toHaveValue('building')
  })

  it('filters by priority and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha')
    await addFeature(u, 'Beta')
    const rowAlpha = featureRow('Alpha')
    await u.selectOptions(within(rowAlpha).getByLabelText(/Priority for Alpha/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filters by status and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature X')
    await addFeature(u, 'Feature Y')
    const rowX = featureRow('Feature X')
    await u.selectOptions(within(rowX).getByLabelText(/Status for Feature X/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Feature X')).toBeInTheDocument()
    expect(screen.queryByText('Feature Y')).not.toBeInTheDocument()
  })

  it('both filters apply simultaneously', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'P0 shipped')
    await addFeature(u, 'P0 idea')
    await addFeature(u, 'P1 shipped')
    const r1 = featureRow('P0 shipped')
    await u.selectOptions(within(r1).getByLabelText(/Priority for P0 shipped/i), 'P0')
    await u.selectOptions(within(r1).getByLabelText(/Status for P0 shipped/i), 'shipped')
    const r2 = featureRow('P0 idea')
    await u.selectOptions(within(r2).getByLabelText(/Priority for P0 idea/i), 'P0')
    const r3 = featureRow('P1 shipped')
    await u.selectOptions(within(r3).getByLabelText(/Status for P1 shipped/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('P0 shipped')).toBeInTheDocument()
  })

  it('Stats shows Total features: 0 and Shipped rate: 0% with no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('Stats shows correct priority and status counts (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feat A')
    await addFeature(u, 'Feat B')
    await addFeature(u, 'Feat C')
    const rowA = featureRow('Feat A')
    await u.selectOptions(within(rowA).getByLabelText(/Priority for Feat A/i), 'P0')
    await u.selectOptions(within(rowA).getByLabelText(/Status for Feat A/i), 'shipped')
    const rowB = featureRow('Feat B')
    await u.selectOptions(within(rowB).getByLabelText(/Status for Feat B/i), 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 3')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 2')).toBeInTheDocument()
    expect(screen.getByText('P2: 0')).toBeInTheDocument()
    expect(screen.getByText('Idea: 1')).toBeInTheDocument()
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 33%')).toBeInTheDocument()
  })

  it('Stats counts ignore active filters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Visible')
    await addFeature(u, 'Hidden by filter')
    const rowH = featureRow('Hidden by filter')
    await u.selectOptions(within(rowH).getByLabelText(/Priority for Hidden by filter/i), 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 2')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persisted feature')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persisted feature')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('Shipped rate is 100% when all features are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Done one')
    await addFeature(u, 'Done two')
    const r1 = featureRow('Done one')
    await u.selectOptions(within(r1).getByLabelText(/Status for Done one/i), 'shipped')
    const r2 = featureRow('Done two')
    await u.selectOptions(within(r2).getByLabelText(/Status for Done two/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
  })
})
