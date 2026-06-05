import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(
  u: U,
  title: string,
  priority: string = 'P1',
  status: string = 'idea',
) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app', () => {
  it('starts on the Backlog view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
  })

  it('shows Features (0) initially', () => {
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

  it('adds a feature and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Dark mode', 'P1', 'idea')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
  })

  it('ignores a blank feature title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('shows priority and status on each row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Billing export', 'P0', 'building')
    const li = screen.getByText('Billing export').closest('li') as HTMLElement
    expect(within(li).getByText('P0')).toBeInTheDocument()
    expect(within(li).getByText('building')).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Remove me', 'P2', 'idea')
    expect(screen.getByText('Remove me')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('filters by priority P0 and updates visible count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Critical fix', 'P0', 'idea')
    await addFeature(u, 'Nice to have', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    expect(screen.getByText('Critical fix')).toBeInTheDocument()
    expect(screen.queryByText('Nice to have')).not.toBeInTheDocument()
  })

  it('filter All restores all visible items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0', 'idea')
    await addFeature(u, 'Beta', 'P1', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
  })

  it('Stats shows Total: 0 and Completion: 0% when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added features (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feat A', 'P0', 'shipped')
    await addFeature(u, 'Feat B', 'P1', 'idea')
    await addFeature(u, 'Feat C', 'P2', 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('Stats Completion is 50% when half shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Done', 'P1', 'shipped')
    await addFeature(u, 'Pending', 'P1', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Stats counts all features even when backlog is filtered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High pri', 'P0', 'shipped')
    await addFeature(u, 'Low pri', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
  })

  it('Stats updates after delete (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Will delete', 'P0', 'shipped')
    await addFeature(u, 'Keep', 'P1', 'idea')
    await u.click(screen.getByRole('button', { name: /delete will delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
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

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Backlog')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('backlog state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Persistent feature', 'P1', 'building')
    await nav(u, 'Stats')
    await nav(u, 'Backlog')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
  })

  it('adds multiple features with different priorities', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Urgent', 'P0', 'idea')
    await addFeature(u, 'Normal', 'P1', 'idea')
    await addFeature(u, 'Later', 'P2', 'idea')
    expect(screen.getByRole('heading', { name: 'Features (3)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
  })

  it('Stats Completion rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'S1', 'P0', 'shipped')
    await addFeature(u, 'S2', 'P1', 'idea')
    await addFeature(u, 'S3', 'P2', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })
})
