// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points?: string) {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), title)
  if (points !== undefined) {
    await u.clear(screen.getByLabelText('Points'))
    await u.type(screen.getByLabelText('Points'), points)
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Sprint Board (held-out)', () => {
  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds two tasks and column counts update independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First', '2')
    await addTask(u, 'Second', '8')
    expect(screen.getByRole('heading', { name: /to do \(2\) — 10 pts/i })).toBeInTheDocument()
  })

  it('moving one task does not affect another tasks column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Stay', '1')
    await addTask(u, 'Go', '1')
    await u.click(within(taskRow('Go')).getByRole('button', { name: /move go right/i }))
    expect(within(col('To Do')).getByText('Stay')).toBeInTheDocument()
    expect(within(col('Doing')).getByText('Go')).toBeInTheDocument()
  })

  it('deleting a done task updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Bye', '5')
    await u.click(within(taskRow('Bye')).getByRole('button', { name: /move bye right/i }))
    await u.click(within(taskRow('Bye')).getByRole('button', { name: /move bye right/i }))
    await u.click(within(taskRow('Bye')).getByRole('button', { name: /delete bye/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('re-unchecking Hide done tasks restores visibility on board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Restore me', '3')
    await u.click(within(taskRow('Restore me')).getByRole('button', { name: /move restore me right/i }))
    await u.click(within(taskRow('Restore me')).getByRole('button', { name: /move restore me right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(within(col('Done')).getByText('Restore me')).toBeInTheDocument()
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

  it('100% completion when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', '1')
    await addTask(u, 'Y', '1')
    await u.click(within(taskRow('X')).getByRole('button', { name: /move x right/i }))
    await u.click(within(taskRow('X')).getByRole('button', { name: /move x right/i }))
    await u.click(within(taskRow('Y')).getByRole('button', { name: /move y right/i }))
    await u.click(within(taskRow('Y')).getByRole('button', { name: /move y right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('stats doing points sums correctly across multiple tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'D1', '3')
    await addTask(u, 'D2', '7')
    await u.click(within(taskRow('D1')).getByRole('button', { name: /move d1 right/i }))
    await u.click(within(taskRow('D2')).getByRole('button', { name: /move d2 right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/doing: 2 tasks, 10 pts/i)).toBeInTheDocument()
  })

  it('left button disabled in todo and right button disabled in done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Boundary', '1')
    expect(within(taskRow('Boundary')).getByRole('button', { name: /move boundary left/i })).toBeDisabled()
    await u.click(within(taskRow('Boundary')).getByRole('button', { name: /move boundary right/i }))
    await u.click(within(taskRow('Boundary')).getByRole('button', { name: /move boundary right/i }))
    expect(within(taskRow('Boundary')).getByRole('button', { name: /move boundary right/i })).toBeDisabled()
    expect(within(taskRow('Boundary')).getByRole('button', { name: /move boundary left/i })).not.toBeDisabled()
  })

  it('done column heading counts hidden tasks even when hide is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Invisible', '6')
    await u.click(within(taskRow('Invisible')).getByRole('button', { name: /move invisible right/i }))
    await u.click(within(taskRow('Invisible')).getByRole('button', { name: /move invisible right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: /done \(1\) — 6 pts/i })).toBeInTheDocument()
  })
})
