// Held-out generalization suite — different inputs, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'high') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Founder Task Tracker (held-out)', () => {
  it('Stats shows 0% when total is 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })

  it('adding only low-priority tasks reflects in Stats Low count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Low A', 'low')
    await addTask(u, 'Low B', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('Low: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Med: 0')).toBeInTheDocument()
  })

  it('done 100% when all tasks toggled done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Only one', 'high')
    await u.click(within(taskRow('Only one')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('filter by High shows correct Showing count with mixed priorities', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'high')
    await addTask(u, 'H2', 'high')
    await addTask(u, 'M1', 'med')
    await addTask(u, 'L1', 'low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByText('Showing: 2 of 4')).toBeInTheDocument()
  })

  it('filter persists within the Tasks view after adding a new task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Existing low', 'low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByText('No tasks to show')).toBeInTheDocument()
    await addTask(u, 'New high', 'high')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('New high')).toBeInTheDocument()
    expect(screen.queryByText('Existing low')).not.toBeInTheDocument()
  })

  it('deleting a task updates Stats Total immediately on navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone soon', 'med')
    await addTask(u, 'Stays', 'high')
    await u.click(within(taskRow('Gone soon')).getByRole('button', { name: /delete gone soon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 0')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
  })

  it('Reset all tasks also resets Stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Wipe me', 'high')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('toggling done off decreases Done count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Back to todo', 'med')
    await u.click(within(taskRow('Back to todo')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    await nav(u, 'Tasks')
    await u.click(within(taskRow('Back to todo')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('theme starts as light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Showing reflects Med filter with three med tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'M1', 'med')
    await addTask(u, 'M2', 'med')
    await addTask(u, 'M3', 'med')
    await addTask(u, 'H1', 'high')
    await u.click(screen.getByRole('button', { name: 'Med' }))
    expect(screen.getByText('Showing: 3 of 4')).toBeInTheDocument()
  })
})
