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

describe('User Interview Tracker', () => {
  it('starts on the Interviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interviews' })).toBeInTheDocument()
  })

  it('shows Showing: 0 interviews on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 interviews')).toBeInTheDocument()
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

  it('Stats shows No interviews yet when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('No interviews yet.')).toBeInTheDocument()
  })

  it('adds an interview and shows it formatted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 interviews')).toBeInTheDocument()
  })

  it('ignores blank participant', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.type(screen.getByLabelText('Key Takeaway'), 'some takeaway')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 0 interviews')).toBeInTheDocument()
  })

  it('ignores blank segment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Bob')
    await u.type(screen.getByLabelText('Key Takeaway'), 'some takeaway')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 0 interviews')).toBeInTheDocument()
  })

  it('ignores blank takeaway', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Bob')
    await u.type(screen.getByLabelText('Segment'), 'SMB')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByText('Showing: 0 interviews')).toBeInTheDocument()
  })

  it('clears the form after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    expect(screen.getByLabelText('Participant')).toHaveValue('')
    expect(screen.getByLabelText('Segment')).toHaveValue('')
    expect(screen.getByLabelText('Key Takeaway')).toHaveValue('')
  })

  it('deletes an interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    expect(screen.queryByText('Alice (Enterprise): Needs better reporting')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 interviews')).toBeInTheDocument()
  })

  it('filters by segment (case-insensitive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await addInterview(u, 'Bob', 'SMB', 'Wants simpler UI')
    await u.type(screen.getByLabelText('Filter by segment'), 'smb')
    expect(screen.queryByText('Alice (Enterprise): Needs better reporting')).not.toBeInTheDocument()
    expect(screen.getByText('Bob (SMB): Wants simpler UI')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 interviews')).toBeInTheDocument()
  })

  it('partial segment filter works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await addInterview(u, 'Carol', 'Enterprise Plus', 'Wants SSO')
    await addInterview(u, 'Bob', 'SMB', 'Wants simpler UI')
    await u.type(screen.getByLabelText('Filter by segment'), 'enter')
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
    expect(screen.getByText('Carol (Enterprise Plus): Wants SSO')).toBeInTheDocument()
    expect(screen.queryByText('Bob (SMB): Wants simpler UI')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 interviews')).toBeInTheDocument()
  })

  it('clearing filter shows all interviews again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await addInterview(u, 'Bob', 'SMB', 'Wants simpler UI')
    const filterInput = screen.getByLabelText('Filter by segment')
    await u.type(filterInput, 'SMB')
    expect(screen.getByText('Showing: 1 interviews')).toBeInTheDocument()
    await u.clear(filterInput)
    expect(screen.getByText('Showing: 2 interviews')).toBeInTheDocument()
  })

  it('Stats shows total and per-segment counts (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await addInterview(u, 'Bob', 'SMB', 'Wants simpler UI')
    await addInterview(u, 'Carol', 'Enterprise', 'Wants SSO')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 2')).toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
  })

  it('Stats updates after deleting an interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await addInterview(u, 'Bob', 'SMB', 'Wants simpler UI')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
    expect(screen.queryByText(/Enterprise/)).not.toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
  })

  it('persists interviews when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Needs better reporting')
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByText('Alice (Enterprise): Needs better reporting')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Interviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Stats shows no segment from a different segment that was deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Key insight')
    await addInterview(u, 'Bob', 'Consumer', 'Another insight')
    await u.click(screen.getByRole('button', { name: 'Delete Bob' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
    expect(screen.queryByText(/Consumer/)).not.toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Key insight')
    await addInterview(u, 'Bob', 'SMB', 'Another insight')
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    expect(screen.getByText('Showing: 1 interviews')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
  })
})
