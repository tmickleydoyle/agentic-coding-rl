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
    expect(screen.getByRole('heading', { name: /interviews/i })).toBeInTheDocument()
  })

  it('seeds three interviews on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows Interviews (3) heading with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interviews (3)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /interviews/i })).toBeInTheDocument()
  })

  it('adds a new interview and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Dave', 'Enterprise', 'Wants API access')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interviews (4)' })).toBeInTheDocument()
  })

  it('ignores submission when any field is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Participant'), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByRole('heading', { name: 'Interviews (3)' })).toBeInTheDocument()
  })

  it('shows the key takeaway of seeded interviews', () => {
    render(<App />)
    expect(screen.getByText('Needs SSO support')).toBeInTheDocument()
    expect(screen.getByText('Wants cheaper pricing')).toBeInTheDocument()
    expect(screen.getByText('Loves the dashboard')).toBeInTheDocument()
  })

  it('deletes an interview and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interviews (2)' })).toBeInTheDocument()
  })

  it('filters interviews by segment (partial, case-insensitive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'enter')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interviews (2)' })).toBeInTheDocument()
  })

  it('clears filter restores all interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByRole('heading', { name: 'Interviews (1)' })).toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter by segment'))
    expect(screen.getByRole('heading', { name: 'Interviews (3)' })).toBeInTheDocument()
  })

  it('Stats shows total interviews reflecting seeded data', async () => {
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

  it('Stats shows segments tracked count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Segments tracked: 2')).toBeInTheDocument()
  })

  it('adding an interview updates Stats total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Eve', 'Startup', 'Needs onboarding help')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Startup: 1')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 3')).toBeInTheDocument()
  })

  it('deleting an interview updates Stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 1')).toBeInTheDocument()
  })

  it('deleting all Enterprise entries removes segment from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.queryByText(/enterprise/i)).not.toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Frank', 'Enterprise', 'Wants SSO')
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interviews (4)' })).toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'SMB')
    expect(screen.getByRole('heading', { name: 'Interviews (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
  })
})
