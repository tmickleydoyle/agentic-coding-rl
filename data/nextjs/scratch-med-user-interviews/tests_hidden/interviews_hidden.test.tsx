import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
  it('partial segment filter matches Enterprise via partial text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'enter')
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('filter is case-insensitive for uppercase input', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'ENTERPRISE')
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('adding two new segments increments Stats total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Hank', 'Nonprofit', 'Budget constraints matter')
    await addInterview(u, 'Iris', 'Government', 'Compliance is critical')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 5')).toBeInTheDocument()
    expect(screen.getByText('Segment: Nonprofit — 1 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Segment: Government — 1 interview(s)')).toBeInTheDocument()
  })

  it('deleting all SMB interviews removes SMB segment entry in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.queryByText(/Segment: SMB/)).not.toBeInTheDocument()
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
  })

  it('adding an interview to an existing segment increments that segment count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'James', 'Enterprise', 'Needs audit logs')
    await nav(u, 'Stats')
    expect(screen.getByText('Segment: Enterprise — 2 interview(s)')).toBeInTheDocument()
  })

  it('filter does not affect Stats totals (Stats is always unfiltered)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('seeded takeaway text is visible in Interviews view', () => {
    render(<App />)
    expect(screen.getByText('Needs faster onboarding')).toBeInTheDocument()
    expect(screen.getByText('Wants SSO support')).toBeInTheDocument()
    expect(screen.getByText('Price is a concern')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme.*light/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme.*dark/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats shows only Enterprise segment after deleting all SMB and adding none', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toContain('Enterprise')
  })

  it('Showing count reacts to deletion while filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
  })
})
