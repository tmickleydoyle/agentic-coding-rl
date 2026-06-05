import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInterview(u: U, participant: string, segment: string, takeaway: string) {
  await u.clear(screen.getByLabelText('Participant'))
  await u.type(screen.getByLabelText('Participant'), participant)
  await u.clear(screen.getByLabelText('Segment'))
  await u.type(screen.getByLabelText('Segment'), segment)
  await u.clear(screen.getByLabelText('Key Takeaway'))
  await u.type(screen.getByLabelText('Key Takeaway'), takeaway)
  await u.click(screen.getByRole('button', { name: /add interview/i }))
}

describe('User Interviews Tracker (held-out)', () => {
  it('Showing count updates after adding multiple interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Hank', 'Mid-market', 'Needs audit logs')
    await addInterview(u, 'Iris', 'Mid-market', 'Wants SSO')
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
  })

  it('filter by a newly added segment works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Jake', 'Gov', 'FedRAMP required')
    await u.type(screen.getByLabelText('Filter by segment'), 'Gov')
    expect(screen.getByText('Jake (Gov): FedRAMP required')).toBeInTheDocument()
    expect(screen.queryByText('Alice (Enterprise): Needs SSO support')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 4')).toBeInTheDocument()
  })

  it('deleting all interviews of a segment removes it from stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await nav(u, 'Stats')
    expect(screen.queryByText(/Segment: SMB/)).not.toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 1')).toBeInTheDocument()
  })

  it('blank segment field prevents add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'NoSeg')
    await u.type(screen.getByLabelText('Key Takeaway'), 'Something')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('blank takeaway field prevents add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'NoTakeaway')
    await u.type(screen.getByLabelText('Segment'), 'SomeSegment')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('stats total is correct after deleting two interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 1')).toBeInTheDocument()
  })

  it('shows formatted row correctly for a newly added entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Lena', 'Nonprofit', 'Grant management pain')
    expect(screen.getByText('Lena (Nonprofit): Grant management pain')).toBeInTheDocument()
  })

  it('toggle theme shows updated label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('filter with no match shows Showing 0 of N', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'ZZZnonexistent')
    expect(screen.getByText('Showing: 0 of 3')).toBeInTheDocument()
  })

  it('stats view shows correct count after adding two of same segment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Mia', 'SMB', 'Needs invoicing')
    await addInterview(u, 'Nate', 'SMB', 'Wants mobile')
    await nav(u, 'Stats')
    expect(screen.getByText('Segment: SMB — 3')).toBeInTheDocument()
  })
})
