import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: 'low' | 'medium' | 'high' = 'low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

describe('Bug Triage Tool', () => {
  it('starts on the Bugs view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('renders seeded bugs on first load', () => {
    render(<App />)
    expect(screen.getByText('Login page crashes')).toBeInTheDocument()
    expect(screen.getByText('Tooltip flicker')).toBeInTheDocument()
    expect(screen.getByText('Wrong favicon')).toBeInTheDocument()
  })

  it('shows Showing: 3 bugs with default all filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
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

  it('adds a new bug and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Button overlap', 'medium')
    expect(screen.getByText('Button overlap')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 bugs')).toBeInTheDocument()
  })

  it('ignores a blank bug title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })

  it('new bugs start as open and show Close button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Cache miss', 'high')
    const li = screen.getByText('Cache miss').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('closes a bug and shows Reopen button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Login page crashes').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Close' }))
    expect(within(li).getByRole('button', { name: 'Reopen' })).toBeInTheDocument()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Wrong favicon').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: 'Reopen' })).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: 'Reopen' }))
    expect(within(li).getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('filter by open shows only open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Login page crashes')).toBeInTheDocument()
    expect(screen.getByText('Tooltip flicker')).toBeInTheDocument()
    expect(screen.queryByText('Wrong favicon')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
  })

  it('filter by closed shows only closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.queryByText('Login page crashes')).not.toBeInTheDocument()
    expect(screen.getByText('Wrong favicon')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
  })

  it('stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('stats view shows seeded severity breakdowns', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Open high severity: 1')).toBeInTheDocument()
    expect(screen.getByText('Open medium severity: 0')).toBeInTheDocument()
    expect(screen.getByText('Open low severity: 1')).toBeInTheDocument()
  })

  it('stats shows closed rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 33%')).toBeInTheDocument()
  })

  it('closing a bug updates stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Login page crashes').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
    expect(screen.getByText('Open high severity: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed rate: 67%')).toBeInTheDocument()
  })

  it('adding a medium bug updates stats severity breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'API timeout', 'medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
    expect(screen.getByText('Open medium severity: 1')).toBeInTheDocument()
  })

  it('stats closed rate is 0% when all bugs are open', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Reopen the one closed seed bug
    const li = screen.getByText('Wrong favicon').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Reopen' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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
})
