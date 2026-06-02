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

describe('User Interviews Tracker', () => {
  it('starts on the Interviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('seeds three interviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice (Enterprise): Needs SSO support')).toBeInTheDocument()
    expect(screen.getByText('Bob (SMB): Wants cheaper pricing')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise): Requests API access')).toBeInTheDocument()
  })

  it('shows correct initial Showing count', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
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

  it('navigates back to Interviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('adds a new interview to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dave', 'Startup', 'Loves integrations')
    expect(screen.getByText('Dave (Startup): Loves integrations')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 of 4')).toBeInTheDocument()
  })

  it('ignores an entry when any field is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'NoSegment')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('deletes an interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    expect(screen.queryByText('Bob (SMB): Wants cheaper pricing')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('filters by segment case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'enterprise')
    expect(screen.getByText('Alice (Enterprise): Needs SSO support')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise): Requests API access')).toBeInTheDocument()
    expect(screen.queryByText('Bob (SMB): Wants cheaper pricing')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 3')).toBeInTheDocument()
  })

  it('filter partial match works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'sm')
    expect(screen.getByText('Bob (SMB): Wants cheaper pricing')).toBeInTheDocument()
    expect(screen.queryByText('Alice (Enterprise): Needs SSO support')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('clearing the filter restores all interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    await u.clear(screen.getByLabelText('Filter by segment'))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('stats view shows total interviews including seeds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('stats view shows per-segment counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Segment: Enterprise — 2')).toBeInTheDocument()
    expect(screen.getByText('Segment: SMB — 1')).toBeInTheDocument()
  })

  it('stats view shows segments tracked count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Segments tracked: 2')).toBeInTheDocument()
  })

  it('adding an interview updates stats cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Eve', 'Enterprise', 'Wants better docs')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Segment: Enterprise — 3')).toBeInTheDocument()
  })

  it('adding a new segment appears in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Frank', 'Agency', 'Needs white-labeling')
    await nav(u, 'Stats')
    expect(screen.getByText('Segment: Agency — 1')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 3')).toBeInTheDocument()
  })

  it('deleting an interview updates stats cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Segment: Enterprise — 1')).toBeInTheDocument()
  })

  it('stats ignores the current filter on Interviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Segment: Enterprise — 2')).toBeInTheDocument()
  })

  it('settings starts with light theme', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Interviews')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Grace', 'Startup', 'Needs mobile app')
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByText('Grace (Startup): Needs mobile app')).toBeInTheDocument()
  })
})
