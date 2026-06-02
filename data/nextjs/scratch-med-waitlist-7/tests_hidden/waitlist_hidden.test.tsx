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

describe('Waitlist Manager (held-out)', () => {
  it('all three seeded entries are visible by default', () => {
    render(<App />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('inviting carol updates her status badge to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('carol@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /invite carol@example.com/i }))
    expect(within(li).getByText('invited')).toBeInTheDocument()
  })

  it('inviting all pending entries shows 100% invite rate in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(aliceLi).getByRole('button', { name: /invite alice@example.com/i }))
    const carolLi = screen.getByText('carol@example.com').closest('li') as HTMLElement
    await u.click(within(carolLi).getByRole('button', { name: /invite carol@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Invited: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('switching filter All to Pending and back to All restores full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('heading', { name: /waitlist \(2\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /waitlist \(3\)/i })).toBeInTheDocument()
  })

  it('adding two entries with the same source increments that source count by 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@x.com', 'Reddit')
    await addEntry(u, 'y@y.com', 'Reddit')
    await nav(u, 'Stats')
    expect(screen.getByText('Reddit: 2')).toBeInTheDocument()
  })

  it('Stats Pending count decreases after an invite', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /invite alice@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('filter Invited count matches Stats Invited count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.getByRole('heading', { name: /waitlist \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('blank-source entry appears as Direct in Stats breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'noSource@test.com', '')
    await nav(u, 'Stats')
    expect(screen.getByText('Direct: 1')).toBeInTheDocument()
  })

  it('theme toggle reflects current theme label on button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('Invited filter hides pending entries added after initial render', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'newpending@test.com', 'Organic')
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.queryByText('newpending@test.com')).not.toBeInTheDocument()
  })

  it('Stats total updates after multiple new entries are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'p1@test.com', 'SEO')
    await addEntry(u, 'p2@test.com', 'SEO')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('SEO: 2')).toBeInTheDocument()
  })
})
