// HELD-OUT generalization tests — fresh scenarios and edge cases.
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
  await u.clear(screen.getByLabelText('Key takeaway'))
  await u.type(screen.getByLabelText('Key takeaway'), takeaway)
  await u.click(screen.getByRole('button', { name: /add interview/i }))
}

describe('User Interview Tracker (held-out)', () => {
  it('seeded key takeaways are visible on load', () => {
    render(<App />)
    expect(screen.getByText('Needs SSO integration')).toBeInTheDocument()
    expect(screen.getByText('Wants better onboarding')).toBeInTheDocument()
    expect(screen.getByText('Concerned about pricing')).toBeInTheDocument()
  })

  it('partial segment filter matches mid-word', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'nter')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('filter matching no segment shows Showing: 0 interview(s)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'zzz-no-match')
    expect(screen.getByText('Showing: 0 interview(s)')).toBeInTheDocument()
  })

  it('adding multiple interviews increments count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dave', 'Consumer', 'Loves UI')
    await addInterview(u, 'Eve', 'Consumer', 'Wants dark mode')
    expect(screen.getByText('Showing: 5 interview(s)')).toBeInTheDocument()
  })

  it('a new segment appears in Stats after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dave', 'Consumer', 'Loves UI')
    await nav(u, 'Stats')
    expect(screen.getByText('Consumer: 1')).toBeInTheDocument()
  })

  it('Stats segment counts update when an interview is deleted cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Delete one Enterprise interview so Enterprise becomes 1
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Enterprise: 1')).toBeInTheDocument()
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
  })

  it('top segment updates to tied-first when counts equalise', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Seed: Enterprise=2, SMB=1. Add another SMB -> tie. Enterprise appeared first -> still top.
    await addInterview(u, 'Dave', 'SMB', 'Needs bulk export')
    await nav(u, 'Stats')
    // Enterprise appeared first in seed so it wins the tie
    expect(screen.getByText('Top segment: Enterprise')).toBeInTheDocument()
  })

  it('Stats shows correct total after delete then add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await addInterview(u, 'Frank', 'Enterprise', 'Wants audit logs')
    await addInterview(u, 'Grace', 'Enterprise', 'Needs SAML')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 4')).toBeInTheDocument()
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

  it('delete clears the participant name and takeaway text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    expect(screen.queryByText('Concerned about pricing')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('Stats total is 0 and no segment lines after deleting everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
    expect(screen.queryByText(/Enterprise/)).not.toBeInTheDocument()
    expect(screen.queryByText(/SMB/)).not.toBeInTheDocument()
  })

  it('filter is local to Interviews and resets visible list when cleared again', async () => {
    const u = userEvent.setup()
    render(<App />)
    const filterInput = screen.getByLabelText('Filter by segment')
    await u.type(filterInput, 'SMB')
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
    await u.clear(filterInput)
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
