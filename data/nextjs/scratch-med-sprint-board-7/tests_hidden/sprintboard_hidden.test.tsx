// HELD-OUT generalization tests — fresh cross-view scenarios, edge cases, and sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points: string) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), points)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board (held-out)', () => {
  it('adding two tasks increments To Do count to 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', '3')
    await addTask(u, 'Review PR', '2')
    expect(screen.getByText('To Do: 2')).toBeInTheDocument()
  })

  it('deleting a doing task decrements Doing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'In progress work', '4')
    await u.selectOptions(screen.getByLabelText('Status for In progress work'), 'doing')
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete In progress work' }))
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
  })

  it('stats total tasks count matches tasks added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Item one', '1')
    await addTask(u, 'Item two', '2')
    await addTask(u, 'Item three', '3')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
  })

  it('deleting a task updates stats total points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Big task', '10')
    await addTask(u, 'Small task', '2')
    await u.click(screen.getByRole('button', { name: 'Delete Big task' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 1')).toBeInTheDocument()
    expect(screen.getByText('Total points: 2')).toBeInTheDocument()
  })

  it('progress is 100% when all tasks done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Full done A', '3')
    await addTask(u, 'Full done B', '7')
    await u.selectOptions(screen.getByLabelText('Status for Full done A'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for Full done B'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 0')).toBeInTheDocument()
  })

  it('can move a task back to todo after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Reversible', '5')
    await u.selectOptions(screen.getByLabelText('Status for Reversible'), 'done')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Status for Reversible'), 'todo')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('hide done setting persists when navigating back to board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone task', '3')
    await u.selectOptions(screen.getByLabelText('Status for Gone task'), 'done')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.queryByText('Gone task')).not.toBeInTheDocument()
    // but Done count still reflects it
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('negative points are ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/task name/i), 'Negative pts')
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), '-5')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
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

  it('stats shows points remaining when some are doing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Ongoing', '8')
    await addTask(u, 'Finished', '2')
    await u.selectOptions(screen.getByLabelText('Status for Ongoing'), 'doing')
    await u.selectOptions(screen.getByLabelText('Status for Finished'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Points done: 2')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 8')).toBeInTheDocument()
  })

  it('input fields clear after adding a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Cleared task', '7')
    expect((screen.getByLabelText(/task name/i) as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText(/^points$/i) as HTMLInputElement).value).toBe('')
  })
})
