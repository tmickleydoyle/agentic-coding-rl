// HELD-OUT generalization tests — fresh scenarios and edge cases not seen during development.
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

describe('User Interview Tracker (held-out)', () => {
  it('filter is case-insensitive — uppercase input matches lower segment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'ENTERPRISE')
    expect(screen.getByRole('heading', { name: 'Interviews (2)' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('adding multiple interviews from the same new segment increments that segment count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'X', 'Nonprofit', 'Budget constraints')
    await addInterview(u, 'Y', 'Nonprofit', 'Volunteer management')
    await nav(u, 'Stats')
    expect(screen.getByText('Nonprofit: 2')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 3')).toBeInTheDocument()
  })

  it('ignores submission when only segment is provided', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Segment'), 'Lonely')
    await u.click(screen.getByRole('button', { name: /add interview/i }))
    expect(screen.getByRole('heading', { name: 'Interviews (3)' })).toBeInTheDocument()
  })

  it('Stats total is 0 when all interviews are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete alice/i }))
    await u.click(screen.getByRole('button', { name: /delete bob/i }))
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 0')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 0')).toBeInTheDocument()
  })

  it('filter with no matching segment shows Interviews (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'zzznomatch')
    expect(screen.getByRole('heading', { name: 'Interviews (0)' })).toBeInTheDocument()
  })

  it('seeded segments appear correctly in Stats on first load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 3')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 2')).toBeInTheDocument()
    expect(screen.getByText('SMB: 1')).toBeInTheDocument()
    expect(screen.getByText('Segments tracked: 2')).toBeInTheDocument()
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

  it('deleting one Enterprise entry leaves Enterprise: 1 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete carol/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Enterprise: 1')).toBeInTheDocument()
    expect(screen.getByText('Total interviews: 2')).toBeInTheDocument()
  })

  it('newly added interview participant appears in Interviews list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Zara', 'Mid-Market', 'Needs better reporting')
    expect(screen.getByText('Zara')).toBeInTheDocument()
    expect(screen.getByText('Mid-Market')).toBeInTheDocument()
    expect(screen.getByText('Needs better reporting')).toBeInTheDocument()
  })

  it('filter input is preserved when adding a new interview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    await addInterview(u, 'Hiro', 'Enterprise', 'Wants bulk exports')
    expect(screen.getByText('Hiro')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interviews (3)' })).toBeInTheDocument()
  })
})
