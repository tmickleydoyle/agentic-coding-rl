// HELD-OUT generalization tests — fresh scenarios, cross-view paths, edge cases.
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

describe('Feature Backlog (held-out)', () => {
  it('P2 filter shows only P2 items and correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High pri', 'P0', 'idea')
    await addFeature(u, 'Low pri A', 'P2', 'idea')
    await addFeature(u, 'Low pri B', 'P2', 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: /features \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('High pri')).not.toBeInTheDocument()
    expect(screen.getByText('Low pri A')).toBeInTheDocument()
    expect(screen.getByText('Low pri B')).toBeInTheDocument()
  })

  it('deleting a filtered-out item does not appear after clearing filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Will be deleted', 'P1', 'idea')
    await addFeature(u, 'Stays', 'P0', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    // only 'Stays' visible; delete it
    await u.click(screen.getByRole('button', { name: /delete stays/i }))
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Will be deleted')).toBeInTheDocument()
  })

  it('stats shows correct P0 P1 P2 breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'A', 'P0', 'idea')
    await addFeature(u, 'B', 'P0', 'building')
    await addFeature(u, 'C', 'P1', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText(/p0: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/p1: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/p2: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
  })

  it('stats completion is 100% when all are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Done1', 'P0', 'shipped')
    await addFeature(u, 'Done2', 'P1', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('delete reduces stats total (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep', 'P1', 'building')
    await addFeature(u, 'Gone', 'P2', 'shipped')
    await u.click(screen.getByRole('button', { name: /delete gone/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/shipped: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('P1 filter after adding only P0 and P2 shows zero count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Alpha', 'P0', 'idea')
    await addFeature(u, 'Beta', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByRole('heading', { name: /features \(0\)/i })).toBeInTheDocument()
  })

  it('adding a shipped feature immediately reflects in Stats shipped count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Launched', 'P0', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText(/shipped: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('building status is displayed on feature row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'In progress', 'P1', 'building')
    const item = screen.getByText('In progress').closest('li') as HTMLElement
    expect(within(item).getByText('building')).toBeInTheDocument()
    expect(within(item).getByText('P1')).toBeInTheDocument()
  })
})
