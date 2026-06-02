// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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

describe('Bug Triage (held-out)', () => {
  it('closing all three seed bugs makes nav show Bugs (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Login fails on Safari')).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Button misaligned on mobile')).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    expect(screen.getByRole('button', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('closing all bugs then Stats shows Open: 0 Closed: 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Login fails on Safari')).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Button misaligned on mobile')).getByRole('button', { name: /close/i }))
    await u.click(within(bugRow('Tooltip flickers')).getByRole('button', { name: /close/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 3')).toBeInTheDocument()
    expect(screen.getByText('High open: 0')).toBeInTheDocument()
    expect(screen.getByText('Medium open: 0')).toBeInTheDocument()
    expect(screen.getByText('Low open: 0')).toBeInTheDocument()
  })

  it('adding a Medium bug increments Medium open in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Broken pagination', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 2')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
  })

  it('adding then closing a High bug makes High open stay at 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Server crash', 'High')
    await u.click(within(bugRow('Server crash')).getByRole('button', { name: /close/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
  })

  it('filter Closed with no closed bugs shows empty list but seed bug count unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Closed')
    expect(screen.queryByText('Login fails on Safari')).not.toBeInTheDocument()
    expect(screen.queryByText('Tooltip flickers')).not.toBeInTheDocument()
    // nav still shows all 3 open
    expect(screen.getByRole('button', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('filter persists within the Bugs view but not in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Login fails on Safari')).getByRole('button', { name: /close/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Open')
    // Login should be hidden
    expect(screen.queryByText('Login fails on Safari')).not.toBeInTheDocument()
    await nav(u, 'Stats')
    // Stats still sees all bugs
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('seed bugs show correct severities', () => {
    render(<App />)
    const highRow = bugRow('Login fails on Safari')
    expect(within(highRow).getByText('High')).toBeInTheDocument()
    const medRow = bugRow('Button misaligned on mobile')
    expect(within(medRow).getByText('Medium')).toBeInTheDocument()
    const lowRow = bugRow('Tooltip flickers')
    expect(within(lowRow).getByText('Low')).toBeInTheDocument()
  })

  it('newly added bug nav count increments correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Extra issue', 'Low')
    expect(screen.getByRole('button', { name: 'Bugs (4)' })).toBeInTheDocument()
  })

  it('Stats view heading is Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('reopening a bug updates Stats Medium open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(bugRow('Button misaligned on mobile')).getByRole('button', { name: /close/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 0')).toBeInTheDocument()
    await nav(u, /bugs/i)
    await u.click(within(bugRow('Button misaligned on mobile')).getByRole('button', { name: /reopen/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
  })
})
