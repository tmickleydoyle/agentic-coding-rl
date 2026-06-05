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

function taskRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Sprint Board (held-out)', () => {
  it('multiple tasks in doing section have correct totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Work item 1', '5')
    await addTask(u, 'Work item 2', '7')
    await u.selectOptions(
      within(taskRow('Work item 1')).getByRole('combobox', { name: /status of work item 1/i }),
      'doing'
    )
    await u.selectOptions(
      within(taskRow('Work item 2')).getByRole('combobox', { name: /status of work item 2/i }),
      'doing'
    )
    expect(screen.getByRole('heading', { name: /doing \(2 tasks, 12 pts\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
  })

  it('deleting a done task updates Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Delete me done', '10')
    await u.selectOptions(
      within(taskRow('Delete me done')).getByRole('combobox', { name: /status of delete me done/i }),
      'done'
    )
    await u.click(within(taskRow('Delete me done')).getByRole('button', { name: /delete delete me done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/done tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('done count heading still shows count when tasks hidden on board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Closed issue', '3')
    await u.selectOptions(
      within(taskRow('Closed issue')).getByRole('combobox', { name: /status of closed issue/i }),
      'done'
    )
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: /done \(1 tasks, 3 pts\)/i })).toBeInTheDocument()
  })

  it('un-hiding done tasks restores them on the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Show again', '6')
    await u.selectOptions(
      within(taskRow('Show again')).getByRole('combobox', { name: /status of show again/i }),
      'done'
    )
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    const doneSection = screen.getByRole('region', { name: 'Done' })
    expect(within(doneSection).getByText('Show again')).toBeInTheDocument()
  })

  it('completion rounds to nearest whole number for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', '2')
    await addTask(u, 'Y', '2')
    await addTask(u, 'Z', '2')
    await u.selectOptions(
      within(taskRow('X')).getByRole('combobox', { name: /status of x/i }),
      'done'
    )
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('stats done points reflect only done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'TodoItem', '4')
    await addTask(u, 'DoneItem', '9')
    await u.selectOptions(
      within(taskRow('DoneItem')).getByRole('combobox', { name: /status of doneitem/i }),
      'done'
    )
    await nav(u, 'Stats')
    expect(screen.getByText(/done points: 9/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 13/i)).toBeInTheDocument()
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

  it('moving a task to done via dropdown reflects cross-view in Stats immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'CrossCheck', '11')
    await u.selectOptions(
      within(taskRow('CrossCheck')).getByRole('combobox', { name: /status of crosscheck/i }),
      'done'
    )
    await nav(u, 'Stats')
    expect(screen.getByText(/done tasks: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/done points: 11/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })
})
