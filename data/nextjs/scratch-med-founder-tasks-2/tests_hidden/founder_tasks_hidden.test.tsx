import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Founder Task Tracker (held-out)', () => {
  it('completion is 0% with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })

  it('completion rounds to 33% for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'task1', 'High')
    await addTask(u, 'task2', 'Medium')
    await addTask(u, 'task3', 'Low')
    await u.click(within(taskRow('task1')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Stats Done count updates after marking undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'flip', 'High')
    await u.click(within(taskRow('flip')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    await nav(u, 'Tasks')
    await u.click(within(taskRow('flip')).getByRole('button', { name: /mark undone/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('deleting a done task reduces both Total and Done in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'gone', 'Low')
    await addTask(u, 'stay', 'High')
    await u.click(within(taskRow('gone')).getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: /delete gone/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Low filter hides High and Medium tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'urgent', 'High')
    await addTask(u, 'normal', 'Medium')
    await addTask(u, 'chill', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('chill')).toBeInTheDocument()
    expect(screen.queryByText('urgent')).not.toBeInTheDocument()
    expect(screen.queryByText('normal')).not.toBeInTheDocument()
  })

  it('Stats High count updates after adding multiple High tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'h1', 'High')
    await addTask(u, 'h2', 'High')
    await addTask(u, 'h3', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 3')).toBeInTheDocument()
  })

  it('theme persists after navigating through all views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Tasks')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
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

  it('clear all then add new task shows Showing: 1 tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'before clear', 'Medium')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    await addTask(u, 'after clear', 'Low')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.queryByText('before clear')).not.toBeInTheDocument()
    expect(screen.getByText('after clear')).toBeInTheDocument()
  })

  it('filter by Medium shows only medium tasks after mixed additions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'big', 'High')
    await addTask(u, 'mid', 'Medium')
    await addTask(u, 'small', 'Low')
    await addTask(u, 'mid2', 'Medium')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Medium')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
    expect(screen.getByText('mid')).toBeInTheDocument()
    expect(screen.getByText('mid2')).toBeInTheDocument()
    expect(screen.queryByText('big')).not.toBeInTheDocument()
    expect(screen.queryByText('small')).not.toBeInTheDocument()
  })
})
