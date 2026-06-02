import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, owner: string) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText('Owner'))
  if (owner) await u.type(screen.getByLabelText('Owner'), owner)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Release Checklist app', () => {
  it('starts on the Checklist view with seeded tasks', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.getByText('Smoke test')).toBeInTheDocument()
  })

  it('shows Remaining: 3 on load (all seeded tasks incomplete)', () => {
    render(<App />)
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Run migrations', 'Carol')
    expect(screen.getByText('Run migrations')).toBeInTheDocument()
    expect(screen.getAllByText('Carol').length).toBeGreaterThan(0)
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('defaults owner to Unassigned when owner field is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Check SSL cert', '')
    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('toggles a task done and updates Remaining count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('marks a task done then undone, restoring count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Smoke test'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    await u.click(screen.getByLabelText('Done: Smoke test'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('task list item has data-done false initially', () => {
    render(<App />)
    const li = screen.getByText('Write release notes').closest('li')
    expect(li).toHaveAttribute('data-done', 'false')
  })

  it('task list item has data-done true after toggling done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    const li = screen.getByText('Deploy to staging').closest('li')
    expect(li).toHaveAttribute('data-done', 'true')
  })

  it('Summary shows correct totals with seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects a completed task (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows By Owner section with remaining counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Alice: 2 remaining')).toBeInTheDocument()
    expect(within(byOwner).getByText('Bob: 1 remaining')).toBeInTheDocument()
  })

  it('By Owner shows 0 remaining when all owner tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Bob: 0 remaining')).toBeInTheDocument()
  })

  it('Summary Completion is 100% when all tasks done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    await u.click(screen.getByLabelText('Done: Smoke test'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Completed: 3')).toBeInTheDocument()
  })

  it('Settings toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Hide completed hides done tasks on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Smoke test'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide completed/i))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Smoke test')).not.toBeInTheDocument()
  })

  it('Hide completed does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Smoke test'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide completed/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
  })

  it('new task added persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Notify stakeholders', 'Dave')
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
  })

  it('new owner appears in Summary By Owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Update changelog', 'Eve')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Eve: 1 remaining')).toBeInTheDocument()
  })
})
