// HELD-OUT generalization tests — fresh scenarios used only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source?: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  if (source) {
    await u.selectOptions(screen.getByLabelText('Source'), source)
  }
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

describe('Waitlist Manager (held-out)', () => {
  it('heading count updates as entries are added one by one', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Entries (0)' })).toBeInTheDocument()
    await addEntry(u, 'a@test.com')
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
    await addEntry(u, 'b@test.com')
    expect(screen.getByRole('heading', { name: 'Entries (2)' })).toBeInTheDocument()
  })

  it('inviting one of several updates Stats invited count (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x1@test.com', 'organic')
    await addEntry(u, 'x2@test.com', 'referral')
    await addEntry(u, 'x3@test.com', 'social')
    await u.click(screen.getByRole('button', { name: 'Invite x2@test.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite x3@test.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invited rate: 67%')).toBeInTheDocument()
  })

  it('Stats per-source counts all correct after mixed adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'p1@test.com', 'social')
    await addEntry(u, 'p2@test.com', 'social')
    await addEntry(u, 'p3@test.com', 'social')
    await addEntry(u, 'p4@test.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('social: 3')).toBeInTheDocument()
    expect(screen.getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('organic: 0')).toBeInTheDocument()
  })

  it('filter by invited shows only invited entries after multiple invites', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'm1@test.com')
    await addEntry(u, 'm2@test.com')
    await addEntry(u, 'm3@test.com')
    await u.click(screen.getByRole('button', { name: 'Invite m1@test.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite m3@test.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByRole('heading', { name: 'Entries (2)' })).toBeInTheDocument()
    expect(screen.getByText('m1@test.com')).toBeInTheDocument()
    expect(screen.queryByText('m2@test.com')).not.toBeInTheDocument()
    expect(screen.getByText('m3@test.com')).toBeInTheDocument()
  })

  it('100% invited rate when all entries are invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'all1@test.com')
    await addEntry(u, 'all2@test.com')
    await u.click(screen.getByRole('button', { name: 'Invite all1@test.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite all2@test.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited rate: 100%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('entries and filter state preserved after Settings round-trip', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'r1@test.com')
    await addEntry(u, 'r2@test.com')
    await u.click(screen.getByRole('button', { name: 'Invite r1@test.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    await nav(u, 'Settings')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
    expect(screen.getByText('r2@test.com')).toBeInTheDocument()
    expect(screen.queryByText('r1@test.com')).not.toBeInTheDocument()
  })

  it('referral source is shown in the entry row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'ref@test.com', 'referral')
    const li = screen.getByText('ref@test.com').closest('li') as HTMLElement
    expect(within(li).getByText('referral')).toBeInTheDocument()
  })

  it('second identical email is silently ignored and count stays same', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'once@test.com', 'organic')
    await addEntry(u, 'once@test.com', 'social')
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })
})
