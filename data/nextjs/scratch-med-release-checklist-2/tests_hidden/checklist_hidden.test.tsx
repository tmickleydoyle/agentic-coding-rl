// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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

describe('Release Checklist (held-out)', () => {
  it('all three seeded tasks are incomplete by default (data-done=false)', () => {
    render(<App />)
    const items = document.querySelectorAll('li[data-done]')
    let falseCount = 0
    items.forEach((li) => { if (li.getAttribute('data-done') === 'false') falseCount++ })
    expect(falseCount).toBe(3)
  })

  it('completing two of three tasks shows Remaining: 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('Summary Completion is 67% when 2 of 3 tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('By Owner shows Alice: 0 remaining when both Alice tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await u.click(screen.getByLabelText('Done: Smoke test'))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Alice: 0 remaining')).toBeInTheDocument()
    expect(within(byOwner).getByText('Bob: 1 remaining')).toBeInTheDocument()
  })

  it('Unassigned owner appears in By Owner when blank owner task added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flip feature flag', '')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Unassigned: 1 remaining')).toBeInTheDocument()
  })

  it('Unassigned task done reduces its remaining to 0 in By Owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flip feature flag', '')
    await u.click(screen.getByLabelText('Done: Flip feature flag'))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Unassigned: 0 remaining')).toBeInTheDocument()
  })

  it('Summary Total tasks updates after adding a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Tag the release', 'Bob')
    await nav(u, 'Summary')
    expect(screen.getByText('Total tasks: 4')).toBeInTheDocument()
  })

  it('hide completed checkbox is unchecked by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    const cb = screen.getByLabelText(/hide completed/i) as HTMLInputElement
    expect(cb.checked).toBe(false)
  })

  it('unchecking Hide completed restores done tasks on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Smoke test'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide completed/i)) // hide
    await u.click(screen.getByLabelText(/hide completed/i)) // show again
    await nav(u, 'Checklist')
    expect(screen.getByText('Smoke test')).toBeInTheDocument()
  })

  it('Remaining heading on Checklist is unaffected by Hide completed setting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write release notes'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide completed/i))
    await nav(u, 'Checklist')
    // Remaining count should still reflect reality
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
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

  it('adding multiple tasks from different owners shows each in By Owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write docs', 'Frank')
    await addTask(u, 'Review PR', 'Grace')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Frank: 1 remaining')).toBeInTheDocument()
    expect(within(byOwner).getByText('Grace: 1 remaining')).toBeInTheDocument()
  })

  it('checklist state persists after navigating to Settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Deploy to staging'))
    await nav(u, 'Settings')
    await nav(u, 'Checklist')
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    const li = screen.getByText('Deploy to staging').closest('li')
    expect(li).toHaveAttribute('data-done', 'true')
  })
})
