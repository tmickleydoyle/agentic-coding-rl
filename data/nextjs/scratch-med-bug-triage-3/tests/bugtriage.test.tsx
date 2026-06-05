import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string = 'low') {
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
  it('starts on the Bugs view with count 0', () => {
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
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('adds a bug and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Login crash', 'high')
    expect(screen.getByText('Login crash')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('new bug starts as open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Null pointer', 'medium')
    expect(within(bugRow('Null pointer')).getByText('open')).toBeInTheDocument()
  })

  it('shows severity on the bug row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Memory leak', 'high')
    expect(within(bugRow('Memory leak')).getByText('high')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('closes a bug and disables Close button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Timeout error', 'low')
    await u.click(screen.getByRole('button', { name: /close timeout error/i }))
    expect(within(bugRow('Timeout error')).getByText('closed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close timeout error/i })).toBeDisabled()
  })

  it('reopen button is disabled on an open bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Open issue', 'low')
    expect(screen.getByRole('button', { name: /reopen open issue/i })).toBeDisabled()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Flaky test', 'medium')
    await u.click(screen.getByRole('button', { name: /close flaky test/i }))
    await u.click(screen.getByRole('button', { name: /reopen flaky test/i }))
    expect(within(bugRow('Flaky test')).getByText('open')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reopen flaky test/i })).toBeDisabled()
  })

  it('filter by open hides closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alpha', 'low')
    await addBug(u, 'Beta', 'low')
    await u.click(screen.getByRole('button', { name: /close alpha/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filter by closed hides open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Gamma', 'high')
    await addBug(u, 'Delta', 'medium')
    await u.click(screen.getByRole('button', { name: /close gamma/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('filter all shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'P', 'low')
    await addBug(u, 'Q', 'high')
    await u.click(screen.getByRole('button', { name: /close p/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('stats shows total bugs cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'X', 'low')
    await addBug(u, 'Y', 'medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
  })

  it('stats shows open and closed counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'A', 'high')
    await addBug(u, 'B', 'low')
    await u.click(screen.getByRole('button', { name: /close a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('stats shows open count by severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'H1', 'high')
    await addBug(u, 'H2', 'high')
    await addBug(u, 'M1', 'medium')
    await addBug(u, 'L1', 'low')
    await u.click(screen.getByRole('button', { name: /close h2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open high: 1')).toBeInTheDocument()
    expect(screen.getByText('Open medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Open low: 1')).toBeInTheDocument()
  })

  it('stats closed rate is 0% with no bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 0%')).toBeInTheDocument()
  })

  it('stats closed rate calculates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'One', 'low')
    await addBug(u, 'Two', 'low')
    await addBug(u, 'Three', 'low')
    await addBug(u, 'Four', 'low')
    await u.click(screen.getByRole('button', { name: /close one/i }))
    await u.click(screen.getByRole('button', { name: /close two/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 50%')).toBeInTheDocument()
  })

  it('theme starts light and toggles to dark', async () => {
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
    await nav(u, 'Bugs')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('bug list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persistent bug', 'medium')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })
})
