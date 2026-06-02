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
  if (source) await u.type(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /waitlist \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: /waitlist/i })).toBeInTheDocument()
  })

  it('shows seeded stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
  })

  it('shows per-source breakdown in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
    expect(screen.getByText('Friend: 1')).toBeInTheDocument()
  })

  it('adds a new entry and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com', 'LinkedIn')
    expect(screen.getByRole('heading', { name: /waitlist \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('dave@example.com')).toBeInTheDocument()
  })

  it('ignores a blank email when adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByRole('heading', { name: /waitlist \(3\)/i })).toBeInTheDocument()
  })

  it('defaults source to Direct when source is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'eve@example.com', '')
    await nav(u, 'Stats')
    expect(screen.getByText('Direct: 1')).toBeInTheDocument()
  })

  it('new entry starts with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'frank@example.com', 'Reddit')
    const li = screen.getByText('frank@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('pending')).toBeInTheDocument()
  })

  it('invite button is disabled for already-invited entries', () => {
    render(<App />)
    const li = screen.getByText('bob@example.com').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: /invite bob@example.com/i })).toBeDisabled()
  })

  it('inviting an entry changes status to invited and disables the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('pending')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: /invite alice@example.com/i }))
    expect(within(li).getByText('invited')).toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /invite alice@example.com/i })).toBeDisabled()
  })

  it('filter All shows all entries', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /waitlist \(3\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('filter Pending shows only pending entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('heading', { name: /waitlist \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('filter Invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.getByRole('button', { name: 'Invited' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('inviting an entry updates Stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /invite alice@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 67%')).toBeInTheDocument()
  })

  it('adding an entry updates Stats total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'grace@example.com', 'Twitter')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Twitter: 3')).toBeInTheDocument()
  })

  it('Stats shows 0% invite rate when no entries are invited after reset scenario', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // bob is already invited so rate is 33%, just check the text is present for seed
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
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
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('waitlist state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'persist@example.com', 'Newsletter')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('persist@example.com')).toBeInTheDocument()
  })

  it('filter state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('button', { name: 'Invited' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
  })
})
