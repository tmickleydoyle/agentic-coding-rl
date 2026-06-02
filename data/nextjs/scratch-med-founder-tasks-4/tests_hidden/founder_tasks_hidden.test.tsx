// HELD-OUT generalization tests — fresh scenarios, not shown to the model.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker (held-out)', () => {
  it('input clears after adding a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Clear me', 'High')
    expect(screen.getByLabelText(/task name/i)).toHaveValue('')
  })

  it('multiple tasks can be marked done independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First task', 'High')
    await addTask(u, 'Second task', 'Medium')
    await u.click(screen.getByRole('button', { name: /mark done first task/i }))
    expect(screen.getByText('First task (done)')).toBeInTheDocument()
    expect(screen.queryByText('Second task (done)')).not.toBeInTheDocument()
  })

  it('Low filter hides High and Medium tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H task', 'High')
    await addTask(u, 'M task', 'Medium')
    await addTask(u, 'L task', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('L task')).toBeInTheDocument()
    expect(screen.queryByText('H task')).not.toBeInTheDocument()
    expect(screen.queryByText('M task')).not.toBeInTheDocument()
  })

  it('all three tasks done gives 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await addTask(u, 'Y', 'Medium')
    await addTask(u, 'Z', 'Low')
    await u.click(screen.getByRole('button', { name: /mark done x/i }))
    await u.click(screen.getByRole('button', { name: /mark done y/i }))
    await u.click(screen.getByRole('button', { name: /mark done z/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('stats remaining decreases as tasks are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'R1', 'High')
    await addTask(u, 'R2', 'High')
    await addTask(u, 'R3', 'High')
    await u.click(screen.getByRole('button', { name: /mark done r1/i }))
    await u.click(screen.getByRole('button', { name: /mark done r2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('toggling undone brings back to remaining count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Bounce', 'Low')
    await u.click(screen.getByRole('button', { name: /mark done bounce/i }))
    await u.click(screen.getByRole('button', { name: /mark undone bounce/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('done tasks are still counted in stats even when filtered out', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Done high', 'High')
    await addTask(u, 'Pending low', 'Low')
    await u.click(screen.getByRole('button', { name: /mark done done high/i }))
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('adding tasks with whitespace-only name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/task name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('priority counts in stats do not include tasks added after navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Early', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    await nav(u, 'Tasks')
    await addTask(u, 'Later', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })
})
