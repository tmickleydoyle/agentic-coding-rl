import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string = 'Low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
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

  it('shows Bugs (0) with no bugs', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
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
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('adds a bug and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Login crash', 'High')
    expect(screen.getByText('Login crash')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('ignores a blank bug title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('new bug starts as open and shows severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Null pointer', 'Medium')
    const row = bugRow('Null pointer')
    expect(within(row).getByText('open')).toBeInTheDocument()
    expect(within(row).getByText('Medium')).toBeInTheDocument()
  })

  it('shows Close button for open bug and closes it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Timeout error', 'Low')
    const row = bugRow('Timeout error')
    expect(within(row).getByRole('button', { name: /close timeout error/i })).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /close timeout error/i }))
    expect(within(bugRow('Timeout error')).getByText('closed')).toBeInTheDocument()
  })

  it('shows Reopen button for closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Cache miss', 'Low')
    await u.click(within(bugRow('Cache miss')).getByRole('button', { name: /close cache miss/i }))
    expect(within(bugRow('Cache miss')).getByRole('button', { name: /reopen cache miss/i })).toBeInTheDocument()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Race condition', 'High')
    await u.click(within(bugRow('Race condition')).getByRole('button', { name: /close race condition/i }))
    await u.click(within(bugRow('Race condition')).getByRole('button', { name: /reopen race condition/i }))
    expect(within(bugRow('Race condition')).getByText('open')).toBeInTheDocument()
  })

  it('filter by Open hides closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Open bug', 'Low')
    await addBug(u, 'Closed bug', 'Low')
    await u.click(within(bugRow('Closed bug')).getByRole('button', { name: /close closed bug/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.getByText('Open bug')).toBeInTheDocument()
    expect(screen.queryByText('Closed bug')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('filter by Closed hides open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alpha', 'Low')
    await addBug(u, 'Beta', 'Low')
    await u.click(within(bugRow('Beta')).getByRole('button', { name: /close beta/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Closed')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('filter All shows every bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'X', 'Low')
    await addBug(u, 'Y', 'Low')
    await u.click(within(bugRow('X')).getByRole('button', { name: /close x/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('Stats shows zero counts when no bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('High (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 0')).toBeInTheDocument()
  })

  it('Stats reflects added and closed bugs (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'H1', 'High')
    await addBug(u, 'H2', 'High')
    await addBug(u, 'M1', 'Medium')
    await u.click(within(bugRow('H2')).getByRole('button', { name: /close h2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 0')).toBeInTheDocument()
  })

  it('Stats updates when a bug is reopened', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Flaky test', 'Medium')
    await u.click(within(bugRow('Flaky test')).getByRole('button', { name: /close flaky test/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    await nav(u, 'Bugs')
    await u.click(within(bugRow('Flaky test')).getByRole('button', { name: /reopen flaky test/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persist me', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Closed')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('theme toggle applies data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('multiple bugs of different severities show correct counts in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'L1', 'Low')
    await addBug(u, 'L2', 'Low')
    await addBug(u, 'M1', 'Medium')
    await addBug(u, 'H1', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 2')).toBeInTheDocument()
  })
})
