// HELD-OUT generalization tests — different inputs, edge cases, fresh cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points: string = '') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  if (points) {
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), points)
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board (held-out)', () => {
  it('multiple tasks have independent status selects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '3')
    await addTask(u, 'Beta', '5')
    await u.selectOptions(screen.getByLabelText(/status for alpha/i), 'done')
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/status for beta/i), 'doing')
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('filter all shows all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Foo', '2')
    await addTask(u, 'Bar', '4')
    await u.selectOptions(screen.getByLabelText(/status for bar/i), 'done')
    await u.selectOptions(screen.getByLabelText(/^filter$/i), 'done')
    expect(screen.queryByText('Foo')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/^filter$/i), 'all')
    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(screen.getByText('Bar')).toBeInTheDocument()
  })

  it('Completion rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'W1', '3')
    await addTask(u, 'W2', '3')
    await addTask(u, 'W3', '3')
    await u.selectOptions(screen.getByLabelText(/status for w1/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total points: 9')).toBeInTheDocument()
    expect(screen.getByText('Done points: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('deleting a done task reduces Done count and affects Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Remove me', '10')
    await u.selectOptions(screen.getByLabelText(/status for remove me/i), 'done')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
  })

  it('clear all tasks also resets Stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'C1', '5')
    await addTask(u, 'C2', '5')
    await u.selectOptions(screen.getByLabelText(/status for c1/i), 'done')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
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

  it('filter doing only shows doing tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'D1', '1')
    await addTask(u, 'D2', '2')
    await addTask(u, 'D3', '3')
    await u.selectOptions(screen.getByLabelText(/status for d2/i), 'doing')
    await u.selectOptions(screen.getByLabelText(/^filter$/i), 'doing')
    expect(screen.queryByText('D1')).not.toBeInTheDocument()
    expect(screen.getByText('D2')).toBeInTheDocument()
    expect(screen.queryByText('D3')).not.toBeInTheDocument()
  })

  it('Stats total points sums all tasks regardless of status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'S1', '7')
    await addTask(u, 'S2', '3')
    await addTask(u, 'S3', '5')
    await u.selectOptions(screen.getByLabelText(/status for s1/i), 'doing')
    await u.selectOptions(screen.getByLabelText(/status for s2/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
    expect(screen.getByText('Total points: 15')).toBeInTheDocument()
    expect(screen.getByText('Done points: 3')).toBeInTheDocument()
  })
})
