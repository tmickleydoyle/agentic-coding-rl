import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Founder Task Tracker (held-out)', () => {
  it('adds three tasks and Showing count updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Med')
    await addTask(u, 'Gamma', 'Low')
    expect(screen.getByText('Showing: 3 task(s)')).toBeInTheDocument()
  })

  it('filter by Med hides High and Low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High one', 'High')
    await addTask(u, 'Med one', 'Med')
    await addTask(u, 'Low one', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Med')
    expect(screen.queryByText('High one')).not.toBeInTheDocument()
    expect(screen.getByText('Med one')).toBeInTheDocument()
    expect(screen.queryByText('Low one')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 task(s)')).toBeInTheDocument()
  })

  it('filter by Low shows only Low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Important', 'High')
    await addTask(u, 'Routine', 'Low')
    await addTask(u, 'Extra', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 2 task(s)')).toBeInTheDocument()
    expect(screen.queryByText('Important')).not.toBeInTheDocument()
  })

  it('Stats shows Done: 33% for 1 of 3 done (rounded)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await addTask(u, 'Y', 'Med')
    await addTask(u, 'Z', 'Low')
    await u.click(within(taskRow('X')).getByRole('checkbox', { name: /done x/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Not done: 2')).toBeInTheDocument()
  })

  it('toggling done twice returns task to not-done in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Undo me', 'High')
    await u.click(within(taskRow('Undo me')).getByRole('checkbox', { name: /done undo me/i }))
    await u.click(within(taskRow('Undo me')).getByRole('checkbox', { name: /done undo me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('deleting a done task updates both Total and Done in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Remove done', 'High')
    await addTask(u, 'Keep', 'Med')
    await u.click(within(taskRow('Remove done')).getByRole('checkbox', { name: /done remove done/i }))
    await u.click(within(taskRow('Remove done')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
  })

  it('Stats High/Med/Low counts update after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Del me', 'High')
    await addTask(u, 'Keep me', 'High')
    await u.click(within(taskRow('Del me')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High: 1')).toBeInTheDocument()
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

  it('filter state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 'High')
    await addTask(u, 'P2', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 1 task(s)')).toBeInTheDocument()
    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.queryByText('P2')).not.toBeInTheDocument()
  })

  it('Stats shows all priorities at 0 for empty task list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Med: 0')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })
})
