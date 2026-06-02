import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Bug Triage app', () => {
  it('starts on the Bugs view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('seeds three bugs on startup', () => {
    render(<App />)
    expect(screen.getByText('Login page crash')).toBeInTheDocument()
    expect(screen.getByText('Typo in footer')).toBeInTheDocument()
    expect(screen.getByText('Slow dashboard load')).toBeInTheDocument()
  })

  it('shows Showing: 3 bugs initially', () => {
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

  it('adds a new bug with selected severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Memory leak')
    await u.selectOptions(screen.getByLabelText('Severity'), 'high')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    expect(screen.getByText('Memory leak')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 bugs')).toBeInTheDocument()
  })

  it('ignores a blank bug title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })

  it('clears the title input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Test bug')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('filters to show only Open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
    expect(screen.getByText('Login page crash')).toBeInTheDocument()
    expect(screen.getByText('Slow dashboard load')).toBeInTheDocument()
    expect(screen.queryByText('Typo in footer')).not.toBeInTheDocument()
  })

  it('filters to show only Closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Closed' }))
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
    expect(screen.getByText('Typo in footer')).toBeInTheDocument()
    expect(screen.queryByText('Login page crash')).not.toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Closed' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })

  it('closes an open bug with the Close button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const loginRow = screen.getByText('Login page crash').closest('li') as HTMLElement
    await u.click(within(loginRow).getByRole('button', { name: 'Close' }))
    expect(within(loginRow).getByRole('button', { name: 'Reopen' })).toBeInTheDocument()
  })

  it('reopens a closed bug with the Reopen button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const footerRow = screen.getByText('Typo in footer').closest('li') as HTMLElement
    await u.click(within(footerRow).getByRole('button', { name: 'Reopen' }))
    expect(within(footerRow).getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('closing a bug changes the filter count (cross-view state filter)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Open' }))
    const loginRow = screen.getByText('Login page crash').closest('li') as HTMLElement
    await u.click(within(loginRow).getByRole('button', { name: 'Close' }))
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('Stats view shows correct initial totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('Stats view shows open bugs by severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Open high: 1')).toBeInTheDocument()
    expect(screen.getByText('Open medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Open low: 0')).toBeInTheDocument()
  })

  it('Stats updates after closing a bug (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const loginRow = screen.getByText('Login page crash').closest('li') as HTMLElement
    await u.click(within(loginRow).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
    expect(screen.getByText('Open high: 0')).toBeInTheDocument()
  })

  it('Stats updates after adding a new bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'API timeout')
    await u.selectOptions(screen.getByLabelText('Severity'), 'medium')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('Open medium: 2')).toBeInTheDocument()
  })

  it('toggles theme in Settings and applies data-theme', async () => {
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
    await u.type(screen.getByLabelText('Title'), 'Persistent bug')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Open' }))
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
  })
})
