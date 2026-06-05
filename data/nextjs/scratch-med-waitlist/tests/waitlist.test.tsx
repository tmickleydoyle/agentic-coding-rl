import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string = 'organic') {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

function entryRow(email: string): HTMLElement {
  const li = screen.getByText(email).closest('li')
  if (!li) throw new Error(`no row for ${email}`)
  return li as HTMLElement
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist Manager' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Waitlist view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Waitlist Manager' })).toBeInTheDocument()
  })

  it('adds an entry and shows it with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'alice@example.com', 'organic')
    const row = entryRow('alice@example.com')
    expect(within(row).getByText('pending')).toBeInTheDocument()
    expect(within(row).getByText('organic')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByRole('heading', { name: /waitlist \(0\)/i })).toBeInTheDocument()
  })

  it('adds entry with referral source', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'bob@example.com', 'referral')
    const row = entryRow('bob@example.com')
    expect(within(row).getByText('referral')).toBeInTheDocument()
  })

  it('inviting an entry changes its status badge to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'carol@example.com', 'social')
    const row = entryRow('carol@example.com')
    await u.click(within(row).getByRole('button', { name: /invite/i }))
    expect(within(entryRow('carol@example.com')).getByText('invited')).toBeInTheDocument()
  })

  it('hides Invite button after inviting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com')
    await u.click(within(entryRow('dave@example.com')).getByRole('button', { name: /invite/i }))
    expect(within(entryRow('dave@example.com')).queryByRole('button', { name: /invite/i })).not.toBeInTheDocument()
  })

  it('filter by pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'e1@example.com')
    await addEntry(u, 'e2@example.com')
    await u.click(within(entryRow('e1@example.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.queryByText('e1@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('e2@example.com')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
  })

  it('filter by invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'f1@example.com')
    await addEntry(u, 'f2@example.com')
    await u.click(within(entryRow('f1@example.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByText('f1@example.com')).toBeInTheDocument()
    expect(screen.queryByText('f2@example.com')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
  })

  it('filter all shows all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'g1@example.com')
    await addEntry(u, 'g2@example.com')
    await u.click(within(entryRow('g1@example.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('g1@example.com')).toBeInTheDocument()
    expect(screen.getByText('g2@example.com')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows total signups and invite rate 0% when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 0')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added entries (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'h1@example.com', 'organic')
    await addEntry(u, 'h2@example.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('Stats invite rate updates after inviting (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'i1@example.com')
    await addEntry(u, 'i2@example.com')
    await u.click(within(entryRow('i1@example.com')).getByRole('button', { name: /invite/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 50%')).toBeInTheDocument()
  })

  it('Stats shows per-source breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'j1@example.com', 'organic')
    await addEntry(u, 'j2@example.com', 'organic')
    await addEntry(u, 'j3@example.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('organic: 2')).toBeInTheDocument()
    expect(screen.getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('social: 0')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Waitlist')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('waitlist state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'k1@example.com', 'social')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('k1@example.com')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
  })

  it('invite rate is 100% when all entries are invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'l1@example.com')
    await u.click(within(entryRow('l1@example.com')).getByRole('button', { name: /invite/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
  })
})
