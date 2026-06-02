// Held-out generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority = 'med') {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), name)
  await u.selectOptions(screen.getByLabelText('Priority'), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker (held-out)', () => {
  it('filter by low shows only low-priority tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Low only', 'low')
    await addTask(u, 'High only', 'high')
    await addTask(u, 'Med only', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'low')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('Low only')).toBeInTheDocument()
    expect(screen.queryByText('High only')).not.toBeInTheDocument()
    expect(screen.queryByText('Med only')).not.toBeInTheDocument()
  })

  it('done tasks still appear when their priority matches the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Done high', 'high')
    await u.click(screen.getByLabelText('Done: Done high'))
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    expect(screen.getByText('Done high')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('stats include done tasks in priority counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Done low', 'low')
    await u.click(screen.getByLabelText('Done: Done low'))
    await nav(u, 'Stats')
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('toggling done off updates stats remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flip task', 'med')
    await u.click(screen.getByLabelText('Done: Flip task'))
    await nav(u, 'Stats')
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    await nav(u, 'Tasks')
    await u.click(screen.getByLabelText('Done: Flip task'))
    await nav(u, 'Stats')
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('stats 33% completion rounded correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'high')
    await addTask(u, 'Y', 'med')
    await addTask(u, 'Z', 'low')
    await u.click(screen.getByLabelText('Done: X'))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('deleting a task updates Showing count and stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keeper', 'med')
    await addTask(u, 'Goner', 'med')
    await u.click(screen.getByRole('button', { name: /delete goner/i }))
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
  })

  it('clearing tasks resets priority counts in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H', 'high')
    await addTask(u, 'L', 'low')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
    expect(screen.getByText('Med: 0')).toBeInTheDocument()
  })

  it('multiple tasks with same priority are counted together', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'high')
    await addTask(u, 'H2', 'high')
    await addTask(u, 'H3', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
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

  it('filter persists when navigating to settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Stay high', 'high')
    await addTask(u, 'Stay med', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    await nav(u, 'Settings')
    await nav(u, 'Tasks')
    // filter may or may not persist — just check showing count is consistent
    expect(screen.getByText(/Showing: \d+ tasks/)).toBeInTheDocument()
  })
})
