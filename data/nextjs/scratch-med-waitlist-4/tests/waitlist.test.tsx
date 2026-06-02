import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.clear(screen.getByLabelText('Source'))
  await u.type(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
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

  it('shows seeded entries on load', () => {
    render(<App />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('shows correct initial summary line', () => {
    render(<App />)
    expect(screen.getByText('Total: 3 | Invited: 1')).toBeInTheDocument()
  })

  it('adds a new entry to the waitlist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com', 'LinkedIn')
    expect(screen.getByText('dave@example.com')).toBeInTheDocument()
    expect(screen.getByText('Total: 4 | Invited: 1')).toBeInTheDocument()
  })

  it('ignores an entry with blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Source'))
    await u.type(screen.getByLabelText('Source'), 'Twitter')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Total: 3 | Invited: 1')).toBeInTheDocument()
  })

  it('ignores an entry with blank source', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Email'))
    await u.type(screen.getByLabelText('Email'), 'nope@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Total: 3 | Invited: 1')).toBeInTheDocument()
  })

  it('invites a pending entry (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const inviteButtons = screen.getAllByRole('button', { name: /^invite$/i })
    await u.click(inviteButtons[0])
    expect(screen.getByText('Total: 3 | Invited: 2')).toBeInTheDocument()
  })

  it('invited entry shows invited text, not an Invite button', async () => {
    const u = userEvent.setup()
    render(<App />)
    // carol is seeded as invited
    const carolLi = screen.getByText('carol@example.com').closest('li') as HTMLElement
    expect(within(carolLi).getByText('invited')).toBeInTheDocument()
    expect(within(carolLi).queryByRole('button', { name: /^invite$/i })).not.toBeInTheDocument()
  })

  it('filter All shows all entries', () => {
    render(<App />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('filter Pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
  })

  it('filter Invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('summary line is unaffected by the active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.getByText('Total: 3 | Invited: 1')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
  })

  it('Stats view shows By source breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
    expect(screen.getByText('ProductHunt: 1')).toBeInTheDocument()
  })

  it('Stats updates after inviting an entry (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const inviteButtons = screen.getAllByRole('button', { name: /^invite$/i })
    await u.click(inviteButtons[0])
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 67%')).toBeInTheDocument()
  })

  it('Stats updates after adding an entry from a new source', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'eve@example.com', 'LinkedIn')
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 4')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn: 1')).toBeInTheDocument()
  })

  it('invite rate is 0% when no entries would be edge case but seeded prevents that; checks after all invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    const inviteButtons = screen.getAllByRole('button', { name: /^invite$/i })
    for (const btn of inviteButtons) {
      await u.click(btn)
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'frank@example.com', 'Reddit')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('frank@example.com')).toBeInTheDocument()
    expect(screen.getByText('Total: 4 | Invited: 1')).toBeInTheDocument()
  })
})
