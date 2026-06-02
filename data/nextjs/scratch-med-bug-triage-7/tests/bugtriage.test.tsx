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
    expect(screen.getByRole('heading', { name: /bugs/i })).toBeInTheDocument()
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

  it('new bug starts with status open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Null pointer', 'Medium')
    expect(within(bugRow('Null pointer')).getByText('open')).toBeInTheDocument()
  })

  it('Close button is enabled for open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Crash on load')
    expect(within(bugRow('Crash on load')).getByRole('button', { name: /close crash on load/i })).not.toBeDisabled()
  })

  it('Reopen button is disabled for open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Crash on load')
    expect(within(bugRow('Crash on load')).getByRole('button', { name: /reopen crash on load/i })).toBeDisabled()
  })

  it('closes a bug and shows closed label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bad redirect')
    await u.click(within(bugRow('Bad redirect')).getByRole('button', { name: /close bad redirect/i }))
    expect(within(bugRow('Bad redirect')).getByText('closed')).toBeInTheDocument()
  })

  it('Close button disabled after closing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Freeze on save')
    await u.click(within(bugRow('Freeze on save')).getByRole('button', { name: /close freeze on save/i }))
    expect(within(bugRow('Freeze on save')).getByRole('button', { name: /close freeze on save/i })).toBeDisabled()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Memory leak')
    await u.click(within(bugRow('Memory leak')).getByRole('button', { name: /close memory leak/i }))
    await u.click(within(bugRow('Memory leak')).getByRole('button', { name: /reopen memory leak/i }))
    expect(within(bugRow('Memory leak')).getByText('open')).toBeInTheDocument()
  })

  it('filter by Open hides closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug A')
    await addBug(u, 'Bug B')
    await u.click(within(bugRow('Bug A')).getByRole('button', { name: /close bug a/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.queryByText('Bug A')).not.toBeInTheDocument()
    expect(screen.getByText('Bug B')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('filter by Closed hides open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug X')
    await addBug(u, 'Bug Y')
    await u.click(within(bugRow('Bug X')).getByRole('button', { name: /close bug x/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Closed')
    expect(screen.queryByText('Bug Y')).not.toBeInTheDocument()
    expect(screen.getByText('Bug X')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('filter All shows every bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Open one')
    await addBug(u, 'Closed one')
    await u.click(within(bugRow('Closed one')).getByRole('button', { name: /close closed one/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('Stats shows correct totals after adding bugs (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alpha', 'High')
    await addBug(u, 'Beta', 'Medium')
    await addBug(u, 'Gamma', 'Low')
    await u.click(within(bugRow('Gamma')).getByRole('button', { name: /close gamma/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 0')).toBeInTheDocument()
  })

  it('Stats counts all bugs regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Visible', 'High')
    await addBug(u, 'Hidden', 'Low')
    await u.click(within(bugRow('Hidden')).getByRole('button', { name: /close hidden/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Bugs')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('bug list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persistent bug', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
  })

  it('shows severity on each bug row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Severe issue', 'High')
    expect(within(bugRow('Severe issue')).getByText('High')).toBeInTheDocument()
  })
})
