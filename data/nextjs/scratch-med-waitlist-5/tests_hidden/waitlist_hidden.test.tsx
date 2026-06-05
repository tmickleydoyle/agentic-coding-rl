// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

function entryRow(email: string): HTMLElement {
  const li = screen.getByText(email).closest('li')
  if (!li) throw new Error(`no row for ${email}`)
  return li as HTMLElement
}

describe('Waitlist Manager (held-out)', () => {
  it('inviting all three seed entries sets banner to Invited: 3 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite bob@example.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite carol@example.com' }))
    expect(screen.getByText('Invited: 3 of 3')).toBeInTheDocument()
  })

  it('invite rate is 100% when all entries are invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite bob@example.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite carol@example.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('filter all shows every entry after inviting one', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite carol@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('adding multiple entries to same source increments source count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@example.com', 'referral')
    await addEntry(u, 'y@example.com', 'referral')
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).getByText('referral: 2')).toBeInTheDocument()
  })

  it('new entry source shown in stats by source section', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'new@example.com', 'other')
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).getByText('other: 1')).toBeInTheDocument()
  })

  it('stats pending count decreases after inviting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await u.click(screen.getByRole('button', { name: 'Invite bob@example.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
  })

  it('entry row shows source for newly added entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'henry@example.com', 'linkedin')
    expect(within(entryRow('henry@example.com')).getByText('linkedin')).toBeInTheDocument()
  })

  it('stats total is 0 and invite rate is 0% with no entries is not reachable but 3 seed entries give Total: 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('theme toggle persists back to Waitlist view', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
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

  it('banner total includes entries added after load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'ivy@example.com', 'twitter')
    await addEntry(u, 'jack@example.com', 'other')
    expect(screen.getByText('Invited: 0 of 5')).toBeInTheDocument()
  })

  it('filter pending shows new pending entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'kate@example.com', 'referral')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByText('kate@example.com')).toBeInTheDocument()
  })

  it('twitter source count is 2 from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).getByText('twitter: 2')).toBeInTheDocument()
  })
})
