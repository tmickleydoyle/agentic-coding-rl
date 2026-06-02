// HELD-OUT generalization tests — fresh scenarios and edge cases.
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

describe('Release Checklist (held-out)', () => {
  it('completion heading on checklist view starts at 0%', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /completion: 0%/i })).toBeInTheDocument()
  })

  it('completing two of three seeded tasks gives 67%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    expect(screen.getByRole('heading', { name: /completion: 67%/i })).toBeInTheDocument()
  })

  it('untoggling a done task reduces completion back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    expect(screen.getByRole('heading', { name: /completion: 33%/i })).toBeInTheDocument()
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    expect(screen.getByRole('heading', { name: /completion: 0%/i })).toBeInTheDocument()
  })

  it('Pending filter hides tasks that are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.queryByText('Notify stakeholders')).not.toBeInTheDocument()
  })

  it('Completed filter shows multiple completed tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await u.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
    expect(screen.queryByText('Notify stakeholders')).not.toBeInTheDocument()
  })

  it('newly added task appears with correct owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Update changelog', 'Grace')
    const item = screen.getByText('Update changelog').closest('li') as HTMLElement
    expect(within(item).getByText('Grace')).toBeInTheDocument()
  })

  it('Summary by-owner updates when a new owner adds a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write docs', 'Heidi')
    await nav(u, 'Summary')
    expect(screen.getByText(/heidi: 1 remaining/i)).toBeInTheDocument()
  })

  it('Summary by-owner shows updated count when Alice completes one task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await nav(u, 'Summary')
    expect(screen.getByText(/alice: 1 remaining/i)).toBeInTheDocument()
  })

  it('Summary remaining equals total minus completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Extra task', 'Ivan')
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await nav(u, 'Summary')
    expect(screen.getByText(/total tasks: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/completed: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/remaining: 3/i)).toBeInTheDocument()
  })

  it('theme button shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('By owner heading is present in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: /by owner/i })).toBeInTheDocument()
  })

  it('Pending filter with no pending tasks shows empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('Summary by-owner section is empty when all tasks completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/done: write release notes/i))
    await u.click(screen.getByLabelText(/done: deploy to staging/i))
    await u.click(screen.getByLabelText(/done: notify stakeholders/i))
    await nav(u, 'Summary')
    expect(screen.queryByText(/remaining/i, { selector: 'li' })).not.toBeInTheDocument()
  })
})
