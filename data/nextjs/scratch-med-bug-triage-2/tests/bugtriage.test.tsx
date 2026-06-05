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
  it('starts on the Bugs view with zero bugs', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /bugs \(0\)/i })).toBeInTheDocument()
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
    await addBug(u, 'Login crash')
    expect(screen.getByText('Login crash')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /bugs \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank bug title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByRole('heading', { name: /bugs \(0\)/i })).toBeInTheDocument()
  })

  it('shows Open badge on a new bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Badge test')
    expect(within(bugRow('Badge test')).getByText('Open')).toBeInTheDocument()
  })

  it('shows the severity in each bug row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'High severity bug', 'high')
    expect(within(bugRow('High severity bug')).getByText('high')).toBeInTheDocument()
  })

  it('closes a bug and shows Closed badge', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Fixable')
    await u.click(screen.getByRole('button', { name: /close bug fixable/i }))
    expect(within(bugRow('Fixable')).getByText('Closed')).toBeInTheDocument()
  })

  it('Close Bug button is disabled after closing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'OneClose')
    await u.click(screen.getByRole('button', { name: /close bug oneclose/i }))
    expect(screen.getByRole('button', { name: /close bug oneclose/i })).toBeDisabled()
  })

  it('All filter shows all bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug A')
    await addBug(u, 'Bug B')
    await u.click(screen.getByRole('button', { name: /close bug bug a/i }))
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    await u.click(screen.getByRole('button', { name: 'All', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(2\)/i })).toBeInTheDocument()
  })

  it('Open filter shows only open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Open one')
    await addBug(u, 'Closed one')
    await u.click(screen.getByRole('button', { name: /close bug closed one/i }))
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Open one')).toBeInTheDocument()
    expect(screen.queryByText('Closed one')).not.toBeInTheDocument()
  })

  it('Closed filter shows only closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Still open')
    await addBug(u, 'Already closed')
    await u.click(screen.getByRole('button', { name: /close bug already closed/i }))
    await u.click(screen.getByRole('button', { name: 'Closed', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Still open')).not.toBeInTheDocument()
    expect(screen.getByText('Already closed')).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'All', pressed: true })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    expect(screen.getByRole('button', { name: 'Open', pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All', pressed: false })).toBeInTheDocument()
  })

  it('Stats shows zeros when no bugs exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('High open: 0')).toBeInTheDocument()
    expect(screen.getByText('Medium open: 0')).toBeInTheDocument()
    expect(screen.getByText('Low open: 0')).toBeInTheDocument()
  })

  it('Stats reflects added bugs (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Critical', 'high')
    await addBug(u, 'Moderate', 'medium')
    await addBug(u, 'Minor', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
    expect(screen.getByText('Low open: 1')).toBeInTheDocument()
  })

  it('Stats updates when a bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'CloseMe', 'high')
    await u.click(screen.getByRole('button', { name: /close bug closeme/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('High open: 0')).toBeInTheDocument()
  })

  it('Stats ignores filter — shows all bugs regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug X')
    await addBug(u, 'Bug Y')
    await u.click(screen.getByRole('button', { name: /close bug bug x/i }))
    await u.click(screen.getByRole('button', { name: 'Closed', pressed: false }))
    // filter is now closed showing 1
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('theme starts as light and data-theme attribute is set', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme.*light/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Bugs')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('bug list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persistent bug', 'medium')
    await nav(u, 'Settings')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /bugs \(1\)/i })).toBeInTheDocument()
  })
})
