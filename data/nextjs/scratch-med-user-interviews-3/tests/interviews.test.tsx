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

describe('User Interview Tracker', () => {
  it('starts on the Interviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Interviews from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('shows seeded interviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
    expect(screen.getByText('Bob (SMB): Onboarding is confusing')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise): Wants API access')).toBeInTheDocument()
  })

  it('shows Showing: 3 for the seeded data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('adds a new interview and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dave', 'Consumer', 'Loves the mobile app')
    expect(screen.getByText('Dave (Consumer): Loves the mobile app')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })

  it('ignores adding an interview when any field is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Nobody')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('clears form fields after successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Eve', 'SMB', 'Price is too high')
    expect(screen.getByLabelText('Participant')).toHaveValue('')
    expect(screen.getByLabelText('Segment')).toHaveValue('')
    expect(screen.getByLabelText('Key Takeaway')).toHaveValue('')
  })

  it('filters by segment (case-insensitive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'enterprise')
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise): Wants API access')).toBeInTheDocument()
    expect(screen.queryByText('Bob (SMB): Onboarding is confusing')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('shows all interviews when filter is cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter by segment'))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Stats shows seeded total interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('Stats shows segment counts for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Enterprise: 2')).toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
  })

  it('Stats shows top segment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top segment: Enterprise')).toBeInTheDocument()
  })

  it('Stats updates when a new interview is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Frank', 'SMB', 'Needs better integrations')
    await addInterview(u, 'Grace', 'SMB', 'Support response too slow')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 5')).toBeInTheDocument()
    expect(screen.getByText('SMB: 3')).toBeInTheDocument()
    expect(screen.getByText('Top segment: SMB')).toBeInTheDocument()
  })

  it('Stats shows top segment as — when no interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all interviews/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
    expect(screen.getByText('Top segment: —')).toBeInTheDocument()
  })

  it('Clear all interviews removes everything from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all interviews/i }))
    await nav(u, 'Interviews')
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
    expect(screen.queryByText('Alice (Enterprise): Needs better reporting')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Interviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('interview list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Hank', 'Consumer', 'Wants dark mode')
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByText('Hank (Consumer): Wants dark mode')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })
})
