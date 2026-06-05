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

describe('Feature Backlog (held-out)', () => {
  it('adds multiple P0 features and count reflects all of them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Critical 1', 'P0')
    await addFeature(u, 'Critical 2', 'P0')
    await addFeature(u, 'Critical 3', 'P0')
    expect(screen.getByText('P0 (3)')).toBeInTheDocument()
    expect(screen.getByText('P1 (0)')).toBeInTheDocument()
  })

  it('shipped percentage rounds correctly for one of three shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'X', 'P0')
    await addFeature(u, 'Y', 'P1')
    await addFeature(u, 'Z', 'P2')
    await u.selectOptions(screen.getByLabelText(/status of X/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 33%')).toBeInTheDocument()
  })

  it('shipped percentage is 100% when all shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Done A', 'P1')
    await addFeature(u, 'Done B', 'P2')
    await u.selectOptions(screen.getByLabelText(/status of Done A/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/status of Done B/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped %: 100%')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('filter by P2 hides P0 and P1 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High priority', 'P0')
    await addFeature(u, 'Medium priority', 'P1')
    await addFeature(u, 'Low priority', 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.queryByText('High priority')).not.toBeInTheDocument()
    expect(screen.queryByText('Medium priority')).not.toBeInTheDocument()
    expect(screen.getByText('Low priority')).toBeInTheDocument()
  })

  it('priority counts show global totals even when filter hides items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'A1', 'P0')
    await addFeature(u, 'A2', 'P0')
    await addFeature(u, 'B1', 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByText('P0 (2)')).toBeInTheDocument()
    expect(screen.getByText('P2 (1)')).toBeInTheDocument()
  })

  it('status can be changed back to idea after setting to shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Rollback', 'P1')
    await u.selectOptions(screen.getByLabelText(/status of Rollback/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/status of Rollback/i), 'idea')
    expect((screen.getByLabelText(/status of Rollback/i) as HTMLSelectElement).value).toBe('idea')
  })

  it('stats counts are updated after status change sequence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Seq1', 'P0')
    await addFeature(u, 'Seq2', 'P1')
    await u.selectOptions(screen.getByLabelText(/status of Seq1/i), 'building')
    await u.selectOptions(screen.getByLabelText(/status of Seq2/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Idea: 0')).toBeInTheDocument()
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats total updates when a new feature is added after viewing stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Early', 'P0')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 1')).toBeInTheDocument()
    await nav(u, 'Backlog')
    await addFeature(u, 'Late', 'P1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 2')).toBeInTheDocument()
  })
})
