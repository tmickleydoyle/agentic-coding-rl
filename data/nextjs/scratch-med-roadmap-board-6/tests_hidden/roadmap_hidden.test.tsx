// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText('Item title'))
  await u.type(screen.getByLabelText('Item title'), title)
  await u.selectOptions(screen.getByLabelText('Quarter'), quarter)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board (held-out)', () => {
  it('adds multiple items and showing count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task 1', 'Q1', 'planned')
    await addItem(u, 'Task 2', 'Q2', 'in-progress')
    await addItem(u, 'Task 3', 'Q1', 'shipped')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('filter Q3 shows zero when no Q3 items exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Only Q1', 'Q1', 'planned')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'Q3')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    expect(screen.queryByText('Only Q1')).not.toBeInTheDocument()
  })

  it('stats 100% shipped when all items are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done1', 'Q1', 'shipped')
    await addItem(u, 'Done2', 'Q2', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped %: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('mark shipped on planned item updates status in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Feature Z', 'Q2', 'planned')
    const li = screen.getByText('Feature Z').closest('li') as HTMLElement
    expect(within(li).getByText('planned')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Mark shipped Feature Z' }))
    expect(within(li).getByText('shipped')).toBeInTheDocument()
  })

  it('mark shipped button disabled after being clicked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Finalized', 'Q4', 'in-progress')
    await u.click(screen.getByRole('button', { name: 'Mark shipped Finalized' }))
    expect(screen.getByRole('button', { name: 'Mark shipped Finalized' })).toBeDisabled()
  })

  it('deleting all items resets stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One', 'Q1', 'shipped')
    await u.click(screen.getByRole('button', { name: 'Delete One' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 0%')).toBeInTheDocument()
  })

  it('filter Q2 then switch to All restores full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Q1', 'planned')
    await addItem(u, 'Beta', 'Q2', 'planned')
    await addItem(u, 'Gamma', 'Q3', 'planned')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'Q2')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'All')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('in-progress items counted correctly in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'W1', 'Q1', 'in-progress')
    await addItem(u, 'W2', 'Q2', 'in-progress')
    await addItem(u, 'W3', 'Q3', 'planned')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 2')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
  })

  it('items added with shipped status show as shipped immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Already done', 'Q1', 'shipped')
    const li = screen.getByText('Already done').closest('li') as HTMLElement
    expect(within(li).getByText('shipped')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark shipped Already done' })).toBeDisabled()
  })
})
