import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view with a heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('shows all five seed entries by default', () => {
    render(<App />)
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
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

  it('navigates back to Waitlist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('shows seed stats: Total 5, Pending 3, Invited 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    expect(screen.getByText('Invited: 2')).toBeInTheDocument()
  })

  it('shows seed invite rate of 40%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 40%')).toBeInTheDocument()
  })

  it('shows source counts from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
    expect(screen.getByText('Reddit: 2')).toBeInTheDocument()
    expect(screen.getByText('Direct: 1')).toBeInTheDocument()
  })

  it('adds a new entry and shows updated Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Email'))
    await u.type(screen.getByLabelText('Email'), 'new@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 6 of 6')).toBeInTheDocument()
    expect(screen.getByText('new@example.com')).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
  })

  it('ignores a duplicate email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'alice@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
  })

  it('new entry defaults to pending and shows Invite button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'frank@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByRole('button', { name: /invite frank@example.com/i })).toBeInTheDocument()
  })

  it('clicking Invite removes the Invite button for that entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    expect(screen.queryByRole('button', { name: /invite alice@example.com/i })).not.toBeInTheDocument()
  })

  it('inviting an entry updates Stats Invited count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
  })

  it('invite rate updates after inviting (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /invite alice@example.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 60%')).toBeInTheDocument()
  })

  it('filter Pending shows only pending entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Pending')
    expect(screen.getByText('Showing: 3 of 5')).toBeInTheDocument()
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('eve@example.com')).not.toBeInTheDocument()
  })

  it('filter Invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    expect(screen.getByText('Showing: 2 of 5')).toBeInTheDocument()
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
  })

  it('filter All restores all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
  })

  it('Stats total is unaffected by filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Invited')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
  })

  it('adding a Direct entry increments Direct source count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'zara@example.com')
    await u.selectOptions(screen.getByLabelText('Source'), 'Direct')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Direct: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 6')).toBeInTheDocument()
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
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Email'), 'persist@example.com')
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('persist@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing: 6 of 6')).toBeInTheDocument()
  })
})
