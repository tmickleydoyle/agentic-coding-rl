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

describe('Release Checklist (held-out)', () => {
  it('remaining count decrements for each task marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    expect(screen.getByRole('heading', { name: /tasks remaining: 2/i })).toBeInTheDocument()
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    expect(screen.getByRole('heading', { name: /tasks remaining: 1/i })).toBeInTheDocument()
  })

  it('completion is 67% when 2 of 3 seeded tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('by-owner section disappears for an owner once all their tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Run smoke tests'))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).queryByText(/Bob/)).not.toBeInTheDocument()
    expect(within(byOwner).getByText('Alice: 2 remaining')).toBeInTheDocument()
  })

  it('filter by Bob shows only Run smoke tests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by owner'), 'Bob')
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.queryByText('Update changelog')).not.toBeInTheDocument()
  })

  it('adding a task with no owner shows Owner: — in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Anonymous task')
    expect(screen.getAllByText('Owner: —').length).toBeGreaterThanOrEqual(1)
  })

  it('unowned tasks show as (none): N remaining in summary by-owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Ownerless item')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).getByText('(none): 1 remaining')).toBeInTheDocument()
  })

  it('summary total includes tasks added after mount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Extra task', 'Frank')
    await addTask(u, 'Another task', 'Frank')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 5')).toBeInTheDocument()
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).getByText('Frank: 2 remaining')).toBeInTheDocument()
  })

  it('resetting and then adding a task shows total 1 in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Checklist')
    await addTask(u, 'Fresh start', 'Grace')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    const byOwner = screen.getByRole('region', { name: 'By owner' })
    expect(within(byOwner).getByText('Grace: 1 remaining')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter resets visually but remaining count always reflects all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by owner'), 'Alice')
    // heading should still reflect ALL tasks remaining, not just filtered
    expect(screen.getByRole('heading', { name: /tasks remaining: 3/i })).toBeInTheDocument()
  })
})
