import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, owner = '') {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), title)
  await u.clear(screen.getByLabelText('Owner'))
  if (owner) await u.type(screen.getByLabelText('Owner'), owner)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Release Checklist app', () => {
  it('starts on the Checklist view with seeded tasks', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /tasks remaining: 3/i })).toBeInTheDocument()
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
    expect(screen.getByText('Update changelog')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: /tasks remaining/i })).toBeInTheDocument()
  })

  it('shows seed task owners correctly', () => {
    render(<App />)
    const items = screen.getAllByText(/Owner:/)
    const texts = items.map((el) => el.textContent)
    expect(texts.filter((t) => t === 'Owner: Alice').length).toBe(2)
    expect(texts.filter((t) => t === 'Owner: Bob').length).toBe(1)
  })

  it('adds a new task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy to production', 'Carol')
    expect(screen.getByText('Deploy to production')).toBeInTheDocument()
    expect(screen.getByText('Owner: Carol')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tasks remaining: 4/i })).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /tasks remaining: 3/i })).toBeInTheDocument()
  })

  it('shows Owner: — for tasks with no owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Unassigned task')
    expect(screen.getAllByText('Owner: —').length).toBeGreaterThanOrEqual(1)
  })

  it('toggles a task done and updates remaining count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    expect(screen.getByRole('heading', { name: /tasks remaining: 2/i })).toBeInTheDocument()
  })

  it('toggles a task back to not-done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    expect(screen.getByRole('heading', { name: /tasks remaining: 2/i })).toBeInTheDocument()
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    expect(screen.getByRole('heading', { name: /tasks remaining: 3/i })).toBeInTheDocument()
  })

  it('filters tasks by owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by owner'), 'Alice')
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Update changelog')).toBeInTheDocument()
    expect(screen.queryByText('Run smoke tests')).not.toBeInTheDocument()
  })

  it('filter All shows all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by owner'), 'Alice')
    await u.selectOptions(screen.getByLabelText('Filter by owner'), 'All')
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
  })

  it('summary shows correct totals for seeded tasks (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('summary updates after toggling a task done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('summary shows by-owner remaining counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).getByText('Alice: 2 remaining')).toBeInTheDocument()
    expect(within(byOwner).getByText('Bob: 1 remaining')).toBeInTheDocument()
  })

  it('summary by-owner updates when a task is marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Update changelog'))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).getByText('Alice: 1 remaining')).toBeInTheDocument()
  })

  it('summary shows 100% when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    await u.click(screen.getByLabelText('Done: Update changelog'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('summary shows 0% and no by-owner rows when list is empty after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).queryByText(/remaining/)).not.toBeInTheDocument()
  })

  it('reset clears checklist view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: /tasks remaining: 0/i })).toBeInTheDocument()
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Notify stakeholders', 'Dave')
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
  })

  it('newly added owner appears in filter dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Tag the release', 'Eve')
    const select = screen.getByLabelText('Filter by owner')
    expect(within(select).getByRole('option', { name: 'Eve' })).toBeInTheDocument()
  })
})
