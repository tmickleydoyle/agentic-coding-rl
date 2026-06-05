// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority: 'high' | 'med' | 'low' = 'med') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText('Priority'), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker (held-out)', () => {
  it('adds three tasks of different priorities and Stats breaks them down', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 'high')
    await addTask(u, 'P2', 'med')
    await addTask(u, 'P3', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done %: 0%')).toBeInTheDocument()
  })

  it('Done % rounds to 33% for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'high')
    await addTask(u, 'Y', 'med')
    await addTask(u, 'Z', 'low')
    await u.click(screen.getAllByRole('button', { name: 'Mark done' })[0])
    await nav(u, 'Stats')
    expect(screen.getByText('Done %: 33%')).toBeInTheDocument()
  })

  it('filter by med only shows med tasks and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'A high', 'high')
    await addTask(u, 'B med', 'med')
    await addTask(u, 'C med', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'med')
    expect(screen.queryByText('A high')).not.toBeInTheDocument()
    expect(screen.getByText('B med')).toBeInTheDocument()
    expect(screen.getByText('C med')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })

  it('filter by low shows 0 when no low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Only high', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'low')
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('marking done then undone brings Done count back to 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flip task', 'med')
    await u.click(screen.getByRole('button', { name: 'Mark done' }))
    await u.click(screen.getByRole('button', { name: 'Mark undone' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done %: 0%')).toBeInTheDocument()
  })

  it('Stats High count includes tasks added as high via the priority dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'high')
    await addTask(u, 'H2', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('theme button label reflects current theme after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('tasks added with high priority appear under high filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Urgent thing', 'high')
    await addTask(u, 'Normal thing', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    const item = screen.getByText('Urgent thing').closest('li') as HTMLElement
    expect(within(item).getByText('high')).toBeInTheDocument()
    expect(screen.queryByText('Normal thing')).not.toBeInTheDocument()
  })

  it('Stats Done % is 100 when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Solo', 'low')
    await u.click(screen.getByRole('button', { name: 'Mark done' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done %: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })
})
