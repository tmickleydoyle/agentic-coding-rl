// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent. Fresh
// cross-route scenarios so a solution that hardcoded the visible suite fails here.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })
function row(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}
async function addTask(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new task/i))
  await u.type(screen.getByLabelText(/new task/i), title)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('ProjectHub (held-out)', () => {
  it('promotes multiple ideas and they all land in To Do', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Backlog')
    for (const idea of ['alpha', 'beta', 'gamma']) {
      await u.clear(screen.getByLabelText(/backlog idea/i))
      await u.type(screen.getByLabelText(/backlog idea/i), idea)
      await u.click(screen.getByRole('button', { name: /add idea/i }))
    }
    await u.click(screen.getByRole('button', { name: /promote alpha/i }))
    await u.click(screen.getByRole('button', { name: /promote gamma/i }))
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: /to do \(2\)/i })).toBeInTheDocument()
    expect(within(col('To Do')).getByText('alpha')).toBeInTheDocument()
    expect(within(col('To Do')).getByText('gamma')).toBeInTheDocument()
  })

  it('computes completion as a rounded third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'one')
    await addTask(u, 'two')
    await addTask(u, 'three')
    await u.click(within(row('one')).getByRole('button', { name: /move one right/i }))
    await u.click(within(row('one')).getByRole('button', { name: /move one right/i })) // one -> Done
    await nav(u, 'Reports')
    expect(screen.getByText(/total tasks: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('re-showing completed restores hidden Done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'closer')
    await u.click(within(row('closer')).getByRole('button', { name: /move closer right/i }))
    await u.click(within(row('closer')).getByRole('button', { name: /move closer right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show completed/i)) // hide
    await u.click(screen.getByLabelText(/show completed/i)) // show again
    await nav(u, 'Board')
    expect(within(col('Done')).getByText('closer')).toBeInTheDocument()
  })

  it('moves a task back left out of Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'wip')
    await u.click(within(row('wip')).getByRole('button', { name: /move wip right/i }))
    await u.click(within(row('wip')).getByRole('button', { name: /move wip right/i }))
    await u.click(within(row('wip')).getByRole('button', { name: /move wip left/i }))
    expect(within(col('Doing')).getByText('wip')).toBeInTheDocument()
  })

  it('reflects a promote in Reports totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Backlog')
    await u.type(screen.getByLabelText(/backlog idea/i), 'scoped')
    await u.click(screen.getByRole('button', { name: /add idea/i }))
    await u.click(screen.getByRole('button', { name: /promote scoped/i }))
    await nav(u, 'Reports')
    expect(screen.getByText(/total tasks: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/to do: 1/i)).toBeInTheDocument()
  })
})
