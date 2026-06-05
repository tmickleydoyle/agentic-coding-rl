// HELD-OUT generalization tests — fresh scenarios to measure generalisation.
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

describe('Waitlist Manager (held-out)', () => {
  it('invite rate is 100% when all entries are invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    // invite all pending seed entries
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Invited: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('filter by Invited count updates after inviting a user', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    expect(screen.getByText('Showing: 2 entries')).toBeInTheDocument()
  })

  it('adding entries with LinkedIn increments LinkedIn source count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@example.com', 'LinkedIn')
    await addEntry(u, 'y@example.com', 'LinkedIn')
    await nav(u, 'Stats')
    expect(screen.getByText('LinkedIn: 3')).toBeInTheDocument()
  })

  it('Clear Invited on already-no-invited-list is a no-op', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove existing invited entry first
    await u.click(screen.getByRole('button', { name: /clear invited/i }))
    const countBefore = screen.getByText(/Showing:/).textContent
    await u.click(screen.getByRole('button', { name: /clear invited/i }))
    expect(screen.getByText(/Showing:/).textContent).toBe(countBefore)
  })

  it('Stats totals reflect Clear Invited action (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /clear invited/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('Referral source appears in Stats only after a Referral entry is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.queryByText(/Referral:/)).not.toBeInTheDocument()
    await nav(u, 'Waitlist')
    await addEntry(u, 'ref@example.com', 'Referral')
    await nav(u, 'Stats')
    expect(screen.getByText('Referral: 1')).toBeInTheDocument()
  })

  it('pending filter count decreases after inviting a visible entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    expect(screen.getByText('Showing: 2 entries')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('multiple new entries each show their source in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'a@test.com', 'Referral')
    await addEntry(u, 'b@test.com', 'Other')
    const aItem = screen.getByText('a@test.com').closest('li') as HTMLElement
    const bItem = screen.getByText('b@test.com').closest('li') as HTMLElement
    expect(within(aItem).getByText('(Referral)')).toBeInTheDocument()
    expect(within(bItem).getByText('(Other)')).toBeInTheDocument()
  })
})
