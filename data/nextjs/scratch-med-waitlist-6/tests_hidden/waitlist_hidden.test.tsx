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

describe('Waitlist Manager (held-out)', () => {
  it('inviting one of three entries gives 33% invite rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'p@a.com', 'organic')
    await addEntry(u, 'q@a.com', 'referral')
    await addEntry(u, 'r@a.com', 'social')
    await u.click(screen.getByRole('button', { name: /invite p@a.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('inviting all entries gives 100% invite rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'full1@a.com')
    await addEntry(u, 'full2@a.com')
    await u.click(screen.getByRole('button', { name: /invite full1@a.com/i }))
    await u.click(screen.getByRole('button', { name: /invite full2@a.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('referral source count is tracked in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'ref1@b.com', 'referral')
    await addEntry(u, 'ref2@b.com', 'referral')
    await addEntry(u, 'ref3@b.com', 'organic')
    await nav(u, 'Stats')
    expect(screen.getByText('referral: 2')).toBeInTheDocument()
    expect(screen.getByText('organic: 1')).toBeInTheDocument()
    expect(screen.getByText('social: 0')).toBeInTheDocument()
  })

  it('social source appears in Stats per-source', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 's1@c.com', 'social')
    await addEntry(u, 's2@c.com', 'social')
    await addEntry(u, 's3@c.com', 'social')
    await nav(u, 'Stats')
    expect(screen.getByText('social: 3')).toBeInTheDocument()
    expect(screen.getByText('organic: 0')).toBeInTheDocument()
    expect(screen.getByText('referral: 0')).toBeInTheDocument()
  })

  it('filter pending after inviting shows correct Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'm1@d.com')
    await addEntry(u, 'm2@d.com')
    await addEntry(u, 'm3@d.com')
    await u.click(screen.getByRole('button', { name: /invite m1@d.com/i }))
    await u.click(screen.getByRole('button', { name: /invite m2@d.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
    expect(screen.queryByText('m1@d.com')).not.toBeInTheDocument()
    expect(screen.getByText('m3@d.com')).toBeInTheDocument()
  })

  it('Invited counter on waitlist view matches Stats invited count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'check1@e.com')
    await addEntry(u, 'check2@e.com')
    await u.click(screen.getByRole('button', { name: /invite check1@e.com/i }))
    const waitlistInvited = screen.getByText('Invited: 1')
    expect(waitlistInvited).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('theme toggle persists when navigating waitlist -> settings -> stats -> waitlist', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('multiple adds and invites are reflected in Stats Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'n1@f.com', 'organic')
    await addEntry(u, 'n2@f.com', 'organic')
    await addEntry(u, 'n3@f.com', 'referral')
    await addEntry(u, 'n4@f.com', 'social')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('invited entry shows Invited label, not Invite button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'done@g.com')
    await u.click(screen.getByRole('button', { name: /invite done@g.com/i }))
    const li = screen.getByText('done@g.com').closest('li') as HTMLElement
    expect(within(li).queryByRole('button', { name: /invite/i })).not.toBeInTheDocument()
    const labels = within(li).getAllByText('Invited')
    expect(labels.length).toBeGreaterThan(0)
  })
})
