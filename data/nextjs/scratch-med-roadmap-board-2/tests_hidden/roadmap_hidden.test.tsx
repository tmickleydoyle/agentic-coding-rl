import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'Planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap app (held-out)', () => {
  it('item count updates correctly with multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Q1', 'Planned')
    await addItem(u, 'Beta', 'Q2', 'In Progress')
    await addItem(u, 'Gamma', 'Q3', 'Shipped')
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('filter Q4 shows zero when no Q4 items exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Only Q1', 'Q1', 'Planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'R1', 'Q1', 'Planned')
    await addItem(u, 'R2', 'Q1', 'Shipped')
    await addItem(u, 'R3', 'Q2', 'Shipped')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 67%')).toBeInTheDocument()
  })

  it('shipping an item via Ship button disables that button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Milestone', 'Q2', 'In Progress')
    const li = screen.getByText('Milestone').closest('li') as HTMLElement
    const btn = within(li).getByRole('button', { name: /ship milestone/i })
    expect(btn).not.toBeDisabled()
    await u.click(btn)
    expect(within(li).getByRole('button', { name: /ship milestone/i })).toBeDisabled()
  })

  it('shipping updates In Progress count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'WIP feature', 'Q3', 'In Progress')
    const li = screen.getByText('WIP feature').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /ship wip feature/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('stats completion is 50% with one of two shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done one', 'Q1', 'Shipped')
    await addItem(u, 'Not done', 'Q1', 'Planned')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 50%')).toBeInTheDocument()
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

  it('reset clears items and Stats shows 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp', 'Q2', 'Shipped')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0%')).toBeInTheDocument()
  })

  it('items added with Shipped status are immediately disabled for Ship', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Already done', 'Q4', 'Shipped')
    const li = screen.getByText('Already done').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: /ship already done/i })).toBeDisabled()
  })

  it('filter by Q2 only shows Q2 items after adding to multiple quarters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1 task', 'Q1', 'Planned')
    await addItem(u, 'Q2 task', 'Q2', 'In Progress')
    await addItem(u, 'Q2 other', 'Q2', 'Shipped')
    await addItem(u, 'Q3 task', 'Q3', 'Planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
    expect(screen.getByText('Q2 task')).toBeInTheDocument()
    expect(screen.getByText('Q2 other')).toBeInTheDocument()
    expect(screen.queryByText('Q1 task')).not.toBeInTheDocument()
    expect(screen.queryByText('Q3 task')).not.toBeInTheDocument()
  })
})
