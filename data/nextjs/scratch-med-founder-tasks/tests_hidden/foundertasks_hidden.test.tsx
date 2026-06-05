// HELD-OUT generalization tests — fresh scenarios not seen during development.
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
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Founder Task Tracker (held-out)', () => {
  it('all three seeded tasks start as not done', () => {
    render(<App />)
    const checkboxes = screen.getAllByRole('checkbox', { name: /done/i })
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked())
  })

  it('can toggle done and then toggle back', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cb = within(taskRow('Set up analytics')).getByRole('checkbox', { name: /done/i })
    await u.click(cb)
    expect(cb).toBeChecked()
    await u.click(cb)
    expect(cb).not.toBeChecked()
  })

  it('Stats: done % is 100 when all tasks are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cbs = screen.getAllByRole('checkbox', { name: /done/i })
    for (let i = 0; i < cbs.length; i++) {
      await u.click(cbs[i])
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
    expect(screen.getByText('Not done: 0')).toBeInTheDocument()
  })

  it('filter by Low shows only low-priority tasks and correct Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Low')
    expect(screen.getByText('Write onboarding email')).toBeInTheDocument()
    expect(screen.queryByText('Launch landing page')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('adding a Medium task increases Medium priority count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Schedule investor call', 'Medium')
    await addTask(u, 'Draft pitch deck', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Medium priority: 3')).toBeInTheDocument()
    expect(screen.getByText('Total tasks: 5')).toBeInTheDocument()
  })

  it('deleting all tasks leaves Showing: 0 of 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(taskRow('Launch landing page')).getByRole('button', { name: /delete launch landing page/i }))
    await u.click(within(taskRow('Set up analytics')).getByRole('button', { name: /delete set up analytics/i }))
    await u.click(within(taskRow('Write onboarding email')).getByRole('button', { name: /delete write onboarding email/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('after Clear all, adding a new task shows Showing: 1 of 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    await addTask(u, 'Fresh start task', 'Low')
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('filter resets to All still shows correct total after a task is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'High')
    await u.click(within(taskRow('Launch landing page')).getByRole('button', { name: /delete launch landing page/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('Stats: high/medium/low priority counts reflect adds and deletes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Extra high', 'High')
    await u.click(within(taskRow('Write onboarding email')).getByRole('button', { name: /delete write onboarding email/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High priority: 2')).toBeInTheDocument()
    expect(screen.getByText('Low priority: 0')).toBeInTheDocument()
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('Stats Not done count decreases as tasks are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cbs = screen.getAllByRole('checkbox', { name: /done/i })
    await u.click(cbs[0])
    await u.click(cbs[1])
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 67%')).toBeInTheDocument()
  })
})
