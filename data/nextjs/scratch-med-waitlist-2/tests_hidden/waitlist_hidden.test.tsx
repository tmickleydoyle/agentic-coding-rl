import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

describe('Waitlist Manager (held-out)', () => {
  it('inviting all pending entries makes invite rate 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await u.click(screen.getByRole('button', { name: /invite carol@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Invited: 3')).toBeInTheDocument()
  })

  it('adding multiple referral entries updates referral count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@x.com', 'referral')
    await addEntry(u, 'y@y.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('referral: 3')).toBeInTheDocument()
  })

  it('filter by invited after inviting shows correct Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
  })

  it('filter all after filtering pending shows all entries again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Stats shows Total increases after multiple entries added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'a1@test.com', 'organic')
    await addEntry(u, 'a2@test.com', 'social')
    await addEntry(u, 'a3@test.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 6')).toBeInTheDocument()
  })

  it('newly added entry with social source appears in social count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'newperson@test.com', 'social')
    await nav(u, 'Stats')
    expect(screen.getByText('social: 2')).toBeInTheDocument()
  })

  it('inviting does not change the Total in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('invited count on Waitlist view matches Stats Invited after invite', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite carol@example.com/i }))
    const waitlistInvited = screen.getByText('Invited: 2')
    expect(waitlistInvited).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('pending filter does not show alice who is invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
  })

  it('new entry added while filter is pending does not appear in list immediately if added as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await addEntry(u, 'newguy@test.com', 'organic')
    // new entry is pending, filter is invited, so it should not appear in visible list
    expect(screen.queryByText('newguy@test.com')).not.toBeInTheDocument()
    // but Showing should still reflect invited-only
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })
})
