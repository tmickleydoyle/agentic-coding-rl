// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board (held-out)', () => {
  it('adding multiple items updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', 'Q1', 'planned')
    await addItem(u, 'Item 2', 'Q1', 'planned')
    await addItem(u, 'Item 3', 'Q2', 'in-progress')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('filter by Q3 shows only Q3 items and correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spring launch', 'Q2', 'planned')
    await addItem(u, 'Fall launch', 'Q3', 'planned')
    await addItem(u, 'Winter launch', 'Q4', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q3')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Fall launch')).toBeInTheDocument()
    expect(screen.queryByText('Spring launch')).not.toBeInTheDocument()
    expect(screen.queryByText('Winter launch')).not.toBeInTheDocument()
  })

  it('shipped count in Roadmap view only counts visible shipped items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', 'Q1', 'planned')
    await addItem(u, 'B', 'Q2', 'planned')
    await addItem(u, 'C', 'Q2', 'planned')
    await u.click(screen.getByRole('button', { name: /ship it a/i }))
    await u.click(screen.getByRole('button', { name: /ship it b/i }))
    // filter to Q2: only B and C visible, B is shipped
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('stats computed correctly with 50% shipped rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One', 'Q1', 'planned')
    await addItem(u, 'Two', 'Q1', 'planned')
    await u.click(screen.getByRole('button', { name: /ship it one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 50%')).toBeInTheDocument()
  })

  it('planned count decrements in stats after shipping', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task A', 'Q1', 'planned')
    await addItem(u, 'Task B', 'Q1', 'planned')
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 2')).toBeInTheDocument()
    await nav(u, 'Roadmap')
    await u.click(screen.getByRole('button', { name: /ship it task a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('in-progress items counted correctly in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'WIP 1', 'Q2', 'in-progress')
    await addItem(u, 'WIP 2', 'Q3', 'in-progress')
    await addItem(u, 'Done 1', 'Q4', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
  })

  it('quarter filter persists when navigating to stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Q1', 'planned')
    await addItem(u, 'Beta', 'Q4', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('theme toggle persists after visiting all three views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Roadmap')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'dark')
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

  it('stats show all items regardless of quarter filter on roadmap', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Q1', 'planned')
    await addItem(u, 'P2', 'Q2', 'in-progress')
    await addItem(u, 'P3', 'Q3', 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })
})
