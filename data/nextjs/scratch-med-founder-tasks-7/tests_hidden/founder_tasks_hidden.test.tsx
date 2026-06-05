// HELD-OUT generalization tests — different scenarios and cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task title/i))
  await u.type(screen.getByLabelText(/task title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker (held-out)', () => {
  it('Medium filter hides High and Low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High item', 'High')
    await addTask(u, 'Med item', 'Medium')
    await addTask(u, 'Low item', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Medium')
    expect(screen.queryByText('High item')).not.toBeInTheDocument()
    expect(screen.getByText('Med item')).toBeInTheDocument()
    expect(screen.queryByText('Low item')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('deleting a task updates Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keep me', 'Low')
    await addTask(u, 'Delete me', 'Low')
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('toggling done twice returns task to not done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flipper', 'Medium')
    const cb = screen.getByLabelText(/done flipper/i) as HTMLInputElement
    await u.click(cb)
    await u.click(cb)
    expect(cb.checked).toBe(false)
  })

  it('stats Remaining equals total minus done after multiple toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'R1', 'High')
    await addTask(u, 'R2', 'High')
    await addTask(u, 'R3', 'Low')
    await u.click(screen.getByLabelText(/done r1/i))
    await u.click(screen.getByLabelText(/done r2/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('two toggles with nav in between still shows correct completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Step A', 'High')
    await addTask(u, 'Step B', 'High')
    await u.click(screen.getByLabelText(/done step a/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
    await nav(u, 'Tasks')
    await u.click(screen.getByLabelText(/done step b/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Low filter showing count matches only low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'L1', 'Low')
    await addTask(u, 'L2', 'Low')
    await addTask(u, 'H1', 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
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

  it('clear all and then add a new task shows Showing: 1 tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old task', 'High')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    await addTask(u, 'Fresh start', 'Medium')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.queryByText('Old task')).not.toBeInTheDocument()
  })

  it('stats High/Medium/Low counts update after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H task', 'High')
    await addTask(u, 'M task', 'Medium')
    await u.click(screen.getByRole('button', { name: /delete h task/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
  })

  it('all tasks shown count correct with no filter set', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await addTask(u, 'Y', 'Medium')
    await addTask(u, 'Z', 'Low')
    expect(screen.getByText('Showing: 3 tasks')).toBeInTheDocument()
  })
})
