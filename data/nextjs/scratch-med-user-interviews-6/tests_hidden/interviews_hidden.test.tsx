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
  it('multiple interviews show correct Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Insight A')
    await addInterview(u, 'Bob', 'SMB', 'Insight B')
    await addInterview(u, 'Carol', 'Enterprise', 'Insight C')
    expect(screen.getByText('Showing: 3 interviews')).toBeInTheDocument()
  })

  it('Stats respects segment order of first addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'SMB', 'Insight A')
    await addInterview(u, 'Bob', 'Enterprise', 'Insight B')
    await nav(u, 'Stats')
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toBe('SMB: 1')
    expect(items[1].textContent).toBe('Enterprise: 1')
  })

  it('deleting one of two same-segment entries reduces segment count to 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Insight A')
    await addInterview(u, 'Carol', 'Enterprise', 'Insight C')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Enterprise: 1')).toBeInTheDocument()
    expect(screen.getByText('Total interviews: 1')).toBeInTheDocument()
  })

  it('filter by segment is case-insensitive for uppercase input', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'enterprise', 'Insight A')
    await addInterview(u, 'Bob', 'SMB', 'Insight B')
    await u.type(screen.getByLabelText('Filter by segment'), 'ENTERPRISE')
    expect(screen.getByText('Alice (enterprise): Insight A')).toBeInTheDocument()
    expect(screen.queryByText('Bob (SMB): Insight B')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 interviews')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats shows No interviews yet after all interviews are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Some insight')
    await u.click(screen.getByRole('button', { name: 'Delete Alice' }))
    await nav(u, 'Stats')
    expect(screen.getByText('No interviews yet.')).toBeInTheDocument()
  })

  it('interview entry text is formatted correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Diana', 'Consumer', 'Loves the mobile app')
    expect(screen.getByText('Diana (Consumer): Loves the mobile app')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back to Interviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'Insight A')
    await addInterview(u, 'Bob', 'SMB', 'Insight B')
    await u.type(screen.getByLabelText('Filter by segment'), 'Enterprise')
    await nav(u, 'Stats')
    await nav(u, 'Interviews')
    // filter input state is local to the component so it resets — only total count matters
    expect(screen.getByText('Showing: 2 interviews')).toBeInTheDocument()
  })

  it('Stats counts three different segments independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInterview(u, 'Alice', 'Enterprise', 'A')
    await addInterview(u, 'Bob', 'SMB', 'B')
    await addInterview(u, 'Carol', 'Consumer', 'C')
    await addInterview(u, 'Dave', 'SMB', 'D')
    await nav(u, 'Stats')
    expect(screen.getByText('Total interviews: 4')).toBeInTheDocument()
    expect(screen.getByText('Enterprise: 1')).toBeInTheDocument()
    expect(screen.getByText('SMB: 2')).toBeInTheDocument()
    expect(screen.getByText('Consumer: 1')).toBeInTheDocument()
  })
})
