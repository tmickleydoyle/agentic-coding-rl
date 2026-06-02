// HELD-OUT generalization tests — fresh scenarios, edge cases, different cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Waitlist Manager (held-out)', () => {
  it('carol and eve are already invited so they have no Invite button', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /invite carol@example.com/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /invite eve@example.com/i })).not.toBeInTheDocument()
  })

  it('alice, bob, dave start with an Invite button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /invite alice@example.com/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /invite bob@example.com/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /invite dave@example.com/i })).toBeInTheDocument()
  })

  it('inviting all pending entries brings Pending to 0 and Invited to 5 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await u.click(screen.getByRole('button', { name: /invite dave@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Invited: 5')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
  })

  it('filter persists when navigating to Stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('Showing: 3 of 5')).toBeInTheDocument()
  })

  it('adding a Twitter entry increments Twitter source count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'twitteruser@example.com')
    await u.selectOptions(screen.getByLabelText('Source'), 'Twitter')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 3')).toBeInTheDocument()
  })

  it('adding a Reddit entry increments Reddit source count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'reddituser@example.com')
    await u.selectOptions(screen.getByLabelText('Source'), 'Reddit')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Reddit: 3')).toBeInTheDocument()
  })

  it('Showing count reflects filter after an entry is invited and filter is Invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    expect(screen.getByText('Showing: 3 of 5')).toBeInTheDocument()
  })

  it('Showing N of M grows when new entry added under All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'growth@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    await u.type(screen.getByLabelText('Email'), 'growth2@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 7 of 7')).toBeInTheDocument()
  })

  it('Stats invite rate rounds correctly for non-exact fractions', async () => {
    const u = userEvent.setup()
    render(<App />)
    // 2 invited of 5 = 40%, invite one more => 3/5 = 60%
    await u.click(screen.getByRole('button', { name: /invite bob@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 60%')).toBeInTheDocument()
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

  it('Pending filter hides newly-invited entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    expect(screen.getByText('Showing: 3 of 5')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    expect(screen.getByText('Showing: 2 of 5')).toBeInTheDocument()
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
  })
})
