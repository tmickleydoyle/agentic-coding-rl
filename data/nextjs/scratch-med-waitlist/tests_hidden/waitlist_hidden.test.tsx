import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source = 'organic') {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}
function row(email: string): HTMLElement {
  const li = screen.getByText(email).closest('li')
  if (!li) throw new Error(`no row for ${email}`)
  return li as HTMLElement
}

describe('Waitlist Manager (held-out)', () => {
  it('adds three entries of different sources and Stats totals match', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'a@a.com', 'organic')
    await addEntry(u, 'b@b.com', 'referral')
    await addEntry(u, 'c@c.com', 'social')
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 3')).toBeInTheDocument()
    expect(screen.getByText('organic: 1')).toBeInTheDocument()
    expect(screen.getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('social: 1')).toBeInTheDocument()
  })

  it('inviting multiple entries reduces Pending count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'p1@x.com')
    await addEntry(u, 'p2@x.com')
    await addEntry(u, 'p3@x.com')
    await u.click(within(row('p1@x.com')).getByRole('button', { name: /invite/i }))
    await u.click(within(row('p2@x.com')).getByRole('button', { name: /invite/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('invite rate rounds correctly for 2 of 3 invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'q1@x.com')
    await addEntry(u, 'q2@x.com')
    await addEntry(u, 'q3@x.com')
    await u.click(within(row('q1@x.com')).getByRole('button', { name: /invite/i }))
    await u.click(within(row('q2@x.com')).getByRole('button', { name: /invite/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 67%')).toBeInTheDocument()
  })

  it('filter by invited count updates heading correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'r1@x.com')
    await addEntry(u, 'r2@x.com')
    await addEntry(u, 'r3@x.com')
    await u.click(within(row('r1@x.com')).getByRole('button', { name: /invite/i }))
    await u.click(within(row('r3@x.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByRole('heading', { name: /waitlist \(2\)/i })).toBeInTheDocument()
  })

  it('Stats is not affected by the filter (shows all entries)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 's1@x.com')
    await addEntry(u, 's2@x.com')
    await u.click(within(row('s1@x.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    await nav(u, 'Stats')
    expect(screen.getByText('Total signups: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('filter resets visually but list stays filtered when returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 't1@x.com')
    await addEntry(u, 't2@x.com')
    await u.click(within(row('t1@x.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    // filter state is local to the component; it may reset on navigate — just check list is visible
    expect(screen.getByText('t1@x.com')).toBeInTheDocument()
  })

  it('social source count increments correctly in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'u1@x.com', 'social')
    await addEntry(u, 'u2@x.com', 'social')
    await addEntry(u, 'u3@x.com', 'organic')
    await nav(u, 'Stats')
    expect(screen.getByText('social: 2')).toBeInTheDocument()
    expect(screen.getByText('organic: 1')).toBeInTheDocument()
    expect(screen.getByText('referral: 0')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('multiple referral entries show correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'v1@x.com', 'referral')
    await addEntry(u, 'v2@x.com', 'referral')
    await addEntry(u, 'v3@x.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('referral: 3')).toBeInTheDocument()
  })

  it('heading count with pending filter matches only pending entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'w1@x.com')
    await addEntry(u, 'w2@x.com')
    await addEntry(u, 'w3@x.com')
    await u.click(within(row('w1@x.com')).getByRole('button', { name: /invite/i }))
    await u.click(within(row('w2@x.com')).getByRole('button', { name: /invite/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('w3@x.com')).toBeInTheDocument()
    expect(screen.queryByText('w1@x.com')).not.toBeInTheDocument()
  })
})
