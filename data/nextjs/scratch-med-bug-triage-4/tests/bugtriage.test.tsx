import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

describe('Bug Triage app', () => {
  it('starts on the Bugs view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /bugs \(/i })).toBeInTheDocument()
  })

  it('seeds two bugs on load', () => {
    render(<App />)
    expect(screen.getByText('Login page crash')).toBeInTheDocument()
    expect(screen.getByText('Typo in footer')).toBeInTheDocument()
  })

  it('shows Bugs (2) with seed data and all filter', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
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

  it('navigates back to Bugs from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('adds a new bug and count increments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Button not working', 'medium')
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
    expect(screen.getByText('Button not working')).toBeInTheDocument()
  })

  it('ignores blank bug titles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('shows severity on each bug row', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const crash = items.find((li) => within(li as HTMLElement).queryByText('Login page crash'))
    expect(within(crash as HTMLElement).getByText('high')).toBeInTheDocument()
  })

  it('shows status open on seed bugs', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const footer = items.find((li) => within(li as HTMLElement).queryByText('Typo in footer'))
    expect(within(footer as HTMLElement).getByText('open')).toBeInTheDocument()
  })

  it('closes a bug and status changes to closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    const items = screen.getAllByRole('listitem')
    const crash = items.find((li) => within(li as HTMLElement).queryByText('Login page crash'))
    expect(within(crash as HTMLElement).getByText('closed')).toBeInTheDocument()
  })

  it('close button absent after bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    expect(screen.queryByRole('button', { name: /close login page crash/i })).not.toBeInTheDocument()
  })

  it('filter by open hides closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.queryByText('Login page crash')).not.toBeInTheDocument()
    expect(screen.getByText('Typo in footer')).toBeInTheDocument()
  })

  it('filter by open updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('filter by closed shows only closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByText('Login page crash')).toBeInTheDocument()
    expect(screen.queryByText('Typo in footer')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
  })

  it('Stats shows correct totals with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
  })

  it('Stats shows open bugs by severity with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 1')).toBeInTheDocument()
  })

  it('closing a bug updates Stats open and closed counts (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('High (open): 0')).toBeInTheDocument()
  })

  it('adding a medium bug updates Stats medium open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Broken chart', 'medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 1')).toBeInTheDocument()
  })

  it('Stats totals are unaffected by the Bugs view filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Bugs')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('filter resets to all still shows both seed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })
})
