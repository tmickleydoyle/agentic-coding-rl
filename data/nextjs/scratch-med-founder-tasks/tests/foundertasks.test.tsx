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

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Launch landing page')).toBeInTheDocument()
    expect(screen.getByText('Set up analytics')).toBeInTheDocument()
    expect(screen.getByText('Write onboarding email')).toBeInTheDocument()
  })

  it('shows correct initial Showing summary with all tasks', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Tasks view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('adds a new task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Buy a domain', 'High')
    expect(screen.getByText('Buy a domain')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 of 4')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('shows the priority label on each task row', () => {
    render(<App />)
    expect(within(taskRow('Launch landing page')).getByText('High')).toBeInTheDocument()
    expect(within(taskRow('Set up analytics')).getByText('Medium')).toBeInTheDocument()
    expect(within(taskRow('Write onboarding email')).getByText('Low')).toBeInTheDocument()
  })

  it('toggles a task done via its checkbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cb = within(taskRow('Launch landing page')).getByRole('checkbox', { name: /done/i })
    expect(cb).not.toBeChecked()
    await u.click(cb)
    expect(cb).toBeChecked()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(taskRow('Set up analytics')).getByRole('button', { name: /delete set up analytics/i }))
    expect(screen.queryByText('Set up analytics')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('filters by High priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'High')
    expect(screen.getByText('Launch landing page')).toBeInTheDocument()
    expect(screen.queryByText('Set up analytics')).not.toBeInTheDocument()
    expect(screen.queryByText('Write onboarding email')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('filters by Medium priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Medium')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Set up analytics')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Low')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('Stats shows seeded counts correctly (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Not done: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
    expect(screen.getByText('High priority: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium priority: 1')).toBeInTheDocument()
    expect(screen.getByText('Low priority: 1')).toBeInTheDocument()
  })

  it('Stats updates when a task is marked done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(taskRow('Launch landing page')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Not done: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('Stats updates when a task is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Cold email 50 leads', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 4')).toBeInTheDocument()
    expect(screen.getByText('High priority: 2')).toBeInTheDocument()
  })

  it('toggles theme and persists it across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all tasks removes everything (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('Stats shows 0% after clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('task list state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })
})
