import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, owner: string) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText(/owner/i))
  await u.type(screen.getByLabelText(/owner/i), owner)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Release Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /completion: 0%/i })).toBeInTheDocument()
  })

  it('shows the three seeded tasks on load', () => {
    render(<App />)
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
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

  it('navigates back to Checklist view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
  })

  it('adds a new task to the checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Run smoke tests', 'Carol')
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('ignores add when task name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/task name/i))
    await u.type(screen.getByLabelText(/owner/i), 'Dave')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
  })

  it('ignores add when owner is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/task name/i), 'Orphan task')
    await u.clear(screen.getByLabelText(/owner/i))
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.queryByText('Orphan task')).not.toBeInTheDocument()
  })

  it('toggles a task done and updates completion percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    expect(screen.getByRole('heading', { name: /completion: 33%/i })).toBeInTheDocument()
  })

  it('filter Pending shows only incomplete tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.queryByText('Deploy to staging')).not.toBeInTheDocument()
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
  })

  it('filter Completed shows only done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    await u.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Completed' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
  })

  it('Summary shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/total tasks: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/completed: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/remaining: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('Summary reflects a completed task (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await nav(u, 'Summary')
    expect(screen.getByText(/completed: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/remaining: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('Summary by-owner section lists owners with remaining tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/alice: 2 remaining/i)).toBeInTheDocument()
    expect(screen.getByText(/bob: 1 remaining/i)).toBeInTheDocument()
  })

  it('Summary by-owner removes owner once all their tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await nav(u, 'Summary')
    expect(screen.queryByText(/bob/i)).not.toBeInTheDocument()
    expect(screen.getByText(/alice: 2 remaining/i)).toBeInTheDocument()
  })

  it('Summary updates when a new task is added then completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Tag release', 'Eve')
    await u.click(screen.getByLabelText(/done: tag release/i))
    await nav(u, 'Summary')
    expect(screen.getByText(/total tasks: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/completed: 1/i)).toBeInTheDocument()
    expect(screen.queryByText(/eve/i)).not.toBeInTheDocument()
  })

  it('theme toggle switches data-theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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

  it('checklist state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persist me', 'Frank')
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('100% completion when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    expect(screen.getByRole('heading', { name: /completion: 100%/i })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
    expect(screen.getByText(/remaining: 0/i)).toBeInTheDocument()
  })
})
