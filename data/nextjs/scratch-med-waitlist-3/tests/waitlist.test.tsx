import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source = 'Twitter') {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('renders seed data on first load', () => {
    render(<App />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('shows correct initial Showing count with all seed entries', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 entries')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('adds a new entry and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com', 'Referral')
    expect(screen.getByText('dave@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 entries')).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 3 entries')).toBeInTheDocument()
  })

  it('new entry starts as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'new@example.com', 'Other')
    const item = screen.getByText('new@example.com').closest('li') as HTMLElement
    expect(within(item).getByText(/pending/)).toBeInTheDocument()
    expect(within(item).getByRole('button', { name: /invite new@example.com/i })).toBeInTheDocument()
  })

  it('inviting a pending entry changes its status to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    const item = screen.getByText('alice@example.com').closest('li') as HTMLElement
    expect(within(item).getByText(/invited/)).toBeInTheDocument()
    expect(within(item).queryByRole('button', { name: /invite alice@example.com/i })).not.toBeInTheDocument()
  })

  it('invited entries do not show an Invite button', () => {
    render(<App />)
    const carolItem = screen.getByText('carol@example.com').closest('li') as HTMLElement
    expect(within(carolItem).queryByRole('button', { name: /invite carol@example.com/i })).not.toBeInTheDocument()
    expect(within(carolItem).getByText(/invited/)).toBeInTheDocument()
  })

  it('filter by Pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 entries')).toBeInTheDocument()
  })

  it('filter by Invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 3 entries')).toBeInTheDocument()
  })

  it('Clear Invited removes invited entries permanently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /clear invited/i }))
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 entries')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
  })

  it('Stats view shows source breakdown for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn: 1')).toBeInTheDocument()
  })

  it('Stats view does not show sources with zero entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.queryByText(/Referral:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Other:/)).not.toBeInTheDocument()
  })

  it('inviting an entry updates Stats view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 67%')).toBeInTheDocument()
  })

  it('adding an entry updates Stats total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'eve@example.com', 'Referral')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Referral: 1')).toBeInTheDocument()
  })

  it('Stats invite rate is 0% when no entries exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await u.click(screen.getByRole('button', { name: /clear invited/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Settings button label shows current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('waitlist state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'persist@example.com', 'Referral')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('persist@example.com')).toBeInTheDocument()
  })
})
