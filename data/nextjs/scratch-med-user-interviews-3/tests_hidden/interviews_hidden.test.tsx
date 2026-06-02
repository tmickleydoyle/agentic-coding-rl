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

describe('User Interview Tracker (held-out)', () => {
  it('adding to a new segment shows that segment in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Ivy', 'Enterprise', 'Needs SSO')
    await addInterview(u, 'Jake', 'Startup', 'Too expensive')
    await nav(u, 'Stats')
    expect(screen.getByText('Startup: 1')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 3')).toBeInTheDocument()
  })

  it('filter by SMB shows only SMB entries after adding more', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Leo', 'SMB', 'Better CSV export')
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.queryByText('Alice (Enterprise): Needs better reporting')).not.toBeInTheDocument()
  })

  it('Stats top segment updates after clearing and re-adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all interviews/i }))
    await nav(u, 'Interviews')
    await addInterview(u, 'Mia', 'Consumer', 'Love the UI')
    await addInterview(u, 'Ned', 'Consumer', 'Needs offline mode')
    await addInterview(u, 'Olga', 'SMB', 'Workflow issues')
    await nav(u, 'Stats')
    expect(screen.getByText('Top segment: Consumer')).toBeInTheDocument()
    expect(screen.getByText('Consumer: 2')).toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
  })

  it('ignores add when only segment is missing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Participant'))
    await u.type(screen.getByLabelText('Participant'), 'Partial')
    await u.clear(screen.getByLabelText('Key Takeaway'))
    await u.type(screen.getByLabelText('Key Takeaway'), 'Something')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('case-insensitive filter matches mixed case input', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'ENTERPRISE')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise): Wants API access')).toBeInTheDocument()
  })

  it('Stats shows total 0 and no segment lines after clear', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all interviews/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
    expect(screen.queryByText(/Enterprise:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/SMB:/)).not.toBeInTheDocument()
  })

  it('theme toggle button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('Showing count updates correctly after multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Paul', 'Enterprise', 'More dashboards')
    await addInterview(u, 'Quinn', 'Enterprise', 'Better alerts')
    expect(screen.getByText('Showing: 5')).toBeInTheDocument()
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })
})
