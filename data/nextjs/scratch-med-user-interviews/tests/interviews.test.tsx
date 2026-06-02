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

  it('shows seeded interviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct initial Showing count', () => {
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

  it('navigates back to Interviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('adds a new interview and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dana', 'Startup', 'Loves fast iteration')
    expect(screen.getByText('Dana')).toBeInTheDocument()
    expect(screen.getByText('Loves fast iteration')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when participant is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.type(screen.getByLabelText('Key Takeaway'), 'Some insight')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when segment is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Eve')
    await u.type(screen.getByLabelText('Key Takeaway'), 'Some insight')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('ignores submission when takeaway is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Eve')
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('filters interviews by segment (case-insensitive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'smb')
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('filter shows zero results for non-matching segment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Nonprofit')
    expect(screen.getByText('Showing: 0 interview(s)')).toBeInTheDocument()
  })

  it('clears filter to show all interviews again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    expect(screen.getByText('Showing: 1 interview(s)')).toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter by segment'))
    expect(screen.getByText('Showing: 3 interview(s)')).toBeInTheDocument()
  })

  it('deletes an interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 interview(s)')).toBeInTheDocument()
  })

  it('Stats shows correct total on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })

  it('Stats shows seeded segment counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Segment: SMB — 2 interview(s)')).toBeInTheDocument()
    expect(screen.getByText('Segment: Enterprise — 1 interview(s)')).toBeInTheDocument()
  })

  it('Stats updates after adding an interview (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Frank', 'SMB', 'Wants better reports')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Segment: SMB — 3 interview(s)')).toBeInTheDocument()
  })

  it('Stats updates after deleting an interview (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Segment: SMB — 1 interview(s)')).toBeInTheDocument()
  })

  it('Stats shows No interviews yet when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('No interviews yet')).toBeInTheDocument()
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
  })

  it('Stats lists segments in alphabetical order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Zara', 'Agency', 'Needs white-labeling')
    await nav(u, 'Stats')
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    const agencyIdx = texts.findIndex((t) => t.includes('Agency'))
    const enterpriseIdx = texts.findIndex((t) => t.includes('Enterprise'))
    const smbIdx = texts.findIndex((t) => t.includes('SMB'))
    expect(agencyIdx).toBeLessThan(enterpriseIdx)
    expect(enterpriseIdx).toBeLessThan(smbIdx)
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

  it('Settings button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: 'Toggle theme (current: light)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle theme (current: light)' }))
    expect(screen.getByRole('button', { name: 'Toggle theme (current: dark)' })).toBeInTheDocument()
  })

  it('interview list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Grace', 'Mid-market', 'Needs integrations')
    await nav(u, 'Settings')
    await nav(u, 'Interviews')
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 interview(s)')).toBeInTheDocument()
  })
})
