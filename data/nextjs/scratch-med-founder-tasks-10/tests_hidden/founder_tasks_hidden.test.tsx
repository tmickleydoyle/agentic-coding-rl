// HELD-OUT generalization tests — fresh scenarios and edge cases not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: 'High' | 'Medium' | 'Low' = 'High') {
  await u.clear(screen.getByLabelText(/task title/i))
  await u.type(screen.getByLabelText(/task title/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Founder Task Tracker (held-out)', () => {
  it('Low filter only shows Low priority tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High one', 'High')
    await addTask(u, 'Low one', 'Low')
    await addTask(u, 'Low two', 'Low')
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByText('Showing: 2 of 3')).toBeInTheDocument()
    expect(screen.queryByText('High one')).not.toBeInTheDocument()
  })

  it('adding a task while a filter is active does not change the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First high', 'High')
    await u.click(screen.getByRole('button', { name: 'High' }))
    await addTask(u, 'Medium task', 'Medium')
    // filter is still High, so new medium task not shown
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('untoggling done makes Stats not done count increase', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Toggle me', 'Medium')
    await u.click(within(taskRow('Toggle me')).getByLabelText(/done/i))
    await u.click(within(taskRow('Toggle me')).getByLabelText(/done/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('Stats rounds down to whole-number percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 'High')
    await addTask(u, 'T2', 'High')
    await addTask(u, 'T3', 'High')
    await u.click(within(taskRow('T1')).getByLabelText(/done/i))
    await nav(u, 'Stats')
    // 1/3 = 33.33... rounded = 33%
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('All filter button has aria-pressed true by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('Stats Low count is correct with multiple low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'L1', 'Low')
    await addTask(u, 'L2', 'Low')
    await addTask(u, 'H1', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Low: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium: 0')).toBeInTheDocument()
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

  it('clearing tasks then adding new ones works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old task', 'High')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    await addTask(u, 'New task', 'Medium')
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
  })

  it('Showing count respects filter after multiple tasks added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'H2', 'High')
    await addTask(u, 'M1', 'Medium')
    await u.click(screen.getByRole('button', { name: 'Medium' }))
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })
})
