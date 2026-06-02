import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string | RegExp) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string) {
  await u.clear(screen.getByLabelText(/bug title/i))
  await u.type(screen.getByLabelText(/bug title/i), title)
  await u.selectOptions(screen.getByLabelText(/severity/i), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

function bugRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Bug Triage app', () => {
  it('starts on the Bugs view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('seeds three initial bugs', () => {
    render(<App />)
    expect(screen.getByText('Login fails on Safari')).toBeInTheDocument()
    expect(screen.getByText('Button misaligned on mobile')).toBeInTheDocument()
    expect(screen.getByText('Tooltip flickers')).toBeInTheDocument()
  })

  it('nav button shows Bugs (3) with three open seed bugs', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Bugs (3)' })).toBeInTheDocument()
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

  it('navigates back to Bugs view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, /bugs/i)
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('adds a new bug and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Crash on export', 'High')
    expect(screen.getByText('Crash on export')).toBeInTheDocument()
  })

  it('ignores a blank bug title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    // still only 3 seed bugs
    expect(screen.getByRole('button', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('closes a bug and button becomes Reopen', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = bugRow('Tooltip flickers')
    await u.click(within(row).getByRole('button', { name: /close/i }))
    expect(within(bugRow('Tooltip flickers')).getByRole('button', { name: /reopen/i })).toBeInTheDocument()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = bugRow('Tooltip flickers')
    await u.click(within(row).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /reopen/i }))
    expect(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('nav open count decreases when a bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    expect(screen.getByRole('button', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('nav open count updates back when a bug is reopened', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /reopen/i }))
    expect(screen.getByRole('button', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('filter Open hides closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Open')
    expect(screen.queryByText('Tooltip flickers')).not.toBeInTheDocument()
    expect(screen.getByText('Login fails on Safari')).toBeInTheDocument()
  })

  it('filter Closed shows only closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Closed')
    expect(screen.getByText('Tooltip flickers')).toBeInTheDocument()
    expect(screen.queryByText('Login fails on Safari')).not.toBeInTheDocument()
  })

  it('filter All shows every bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Closed')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByText('Tooltip flickers')).toBeInTheDocument()
    expect(screen.getByText('Login fails on Safari')).toBeInTheDocument()
  })

  it('Stats shows correct totals for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
    expect(screen.getByText('Low open: 1')).toBeInTheDocument()
  })

  it('Stats reflects a closed bug (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('Low open: 0')).toBeInTheDocument()
  })

  it('Stats ignores the Bugs view filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Open')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('Stats updates when a new bug is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'New regression', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
    expect(screen.getByText('High open: 2')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, /bugs/i)
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves bugs state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Memory leak', 'Medium')
    await nav(u, 'Stats')
    await nav(u, /bugs/i)
    expect(screen.getByText('Memory leak')).toBeInTheDocument()
  })
})
