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

describe('User Interview Tracker', () => {
  it('starts on the Interviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('renders the three seeded interviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows Showing: 3 interview(s) with seed data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
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

  it('navigates back to Interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('adds a new interview and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Diana', 'Consumer', 'Loves the mobile app')
    expect(screen.getByText('Diana')).toBeInTheDocument()
    expect(screen.getByText('Loves the mobile app')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when participant is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.type(screen.getByLabelText('Key takeaway'), 'Something')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when segment is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Eve')
    await u.type(screen.getByLabelText('Key takeaway'), 'Something')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when key takeaway is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Eve')
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('deletes an interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
  })

  it('filters interviews by segment (case-insensitive partial match)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'enterprise')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
  })

  it('filter shows all when cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter by segment'))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('Stats shows total from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('Stats shows per-segment counts', async () => {
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

  it('Stats reflects a newly added interview (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Diana', 'SMB', 'Loves the mobile app')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('SMB: 2')).toBeInTheDocument()
  })

  it('Stats updates top segment after adding interviews (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Diana', 'SMB', 'Pricing concern')
    await addInterview(u, 'Evan', 'SMB', 'Wants API access')
    await nav(u, 'Stats')
    expect(screen.getByText('Top segment: SMB')).toBeInTheDocument()
  })

  it('Stats shows top segment as — when all interviews deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
    expect(screen.getByText('Top segment: —')).toBeInTheDocument()
  })

  it('Stats reflects a deleted interview (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await u.click(screen.getByRole('button', { name: 'Delete Carol' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
    expect(screen.getByText('Top segment: SMB')).toBeInTheDocument()
  })

  it('Settings toggles theme and persists across views', async () => {
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

  it('filter does not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
  })

  it('interview state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Frank', 'Enterprise', 'Needs SLA')
    await nav(u, 'Settings')
    await nav(u, 'Interviews')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 interview(s)')).toBeInTheDocument()
  })
})
