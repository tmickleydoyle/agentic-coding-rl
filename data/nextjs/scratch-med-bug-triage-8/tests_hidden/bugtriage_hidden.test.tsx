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

describe('Bug Triage (held-out)', () => {
  it('Bug count heading matches number of bugs added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'First', 'Low')
    await addBug(u, 'Second', 'Medium')
    await addBug(u, 'Third', 'High')
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('closing a bug removes Close button and shows Reopen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Segfault', 'High')
    await u.click(within(bugRow('Segfault')).getByRole('button', { name: /close segfault/i }))
    expect(within(bugRow('Segfault')).queryByRole('button', { name: /close segfault/i })).not.toBeInTheDocument()
    expect(within(bugRow('Segfault')).getByRole('button', { name: /reopen segfault/i })).toBeInTheDocument()
  })

  it('filter Closed shows count of only closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'P', 'Low')
    await addBug(u, 'Q', 'Low')
    await addBug(u, 'R', 'Low')
    await u.click(within(bugRow('P')).getByRole('button', { name: /close p/i }))
    await u.click(within(bugRow('Q')).getByRole('button', { name: /close q/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Closed')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('filter Open after closing all shows Bugs (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Foo', 'Medium')
    await u.click(within(bugRow('Foo')).getByRole('button', { name: /close foo/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('Stats counts all bugs ignoring the current filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Visible', 'High')
    await addBug(u, 'Hidden', 'High')
    await u.click(within(bugRow('Hidden')).getByRole('button', { name: /close hidden/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('High (open) decrements when a High bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Critical1', 'High')
    await addBug(u, 'Critical2', 'High')
    await u.click(within(bugRow('Critical1')).getByRole('button', { name: /close critical1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
  })

  it('Medium (open) increments correctly with mixed severities', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'M-bug1', 'Medium')
    await addBug(u, 'M-bug2', 'Medium')
    await addBug(u, 'H-bug', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Medium (open): 2')).toBeInTheDocument()
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
  })

  it('theme persists back to Bugs view', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Bugs')
    expect(root()).toHaveAttribute('data-theme', 'dark')
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

  it('bugs list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Sticky bug', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Sticky bug')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('reopening a bug makes it appear under Open filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Back from dead', 'Low')
    await u.click(within(bugRow('Back from dead')).getByRole('button', { name: /close back from dead/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.queryByText('Back from dead')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    await u.click(within(bugRow('Back from dead')).getByRole('button', { name: /reopen back from dead/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.getByText('Back from dead')).toBeInTheDocument()
  })
})
