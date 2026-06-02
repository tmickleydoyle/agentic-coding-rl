import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string = 'organic') {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('shows Showing: 0 entries on a fresh load', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 entries')).toBeInTheDocument()
  })

  it('shows Invited: 0 on a fresh load', () => {
    render(<App />)
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
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

  it('adds an entry and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'alice@example.com', 'organic')
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
    expect(screen.getByText('Showing: 0 entries')).toBeInTheDocument()
  })

  it('new entries start with status pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'bob@example.com')
    const li = screen.getByText('bob@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('pending')).toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /invite bob@example.com/i })).toBeInTheDocument()
  })

  it('inviting an entry changes its status to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'carol@example.com')
    await u.click(screen.getByRole('button', { name: /invite carol@example.com/i }))
    const li = screen.getByText('carol@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('invited')).toBeInTheDocument()
    expect(within(li).queryByRole('button', { name: /invite/i })).not.toBeInTheDocument()
  })

  it('invited count increments when an entry is invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com')
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /invite dave@example.com/i }))
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('filter by pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'eve@example.com')
    await addEntry(u, 'frank@example.com')
    await u.click(screen.getByRole('button', { name: /invite eve@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.queryByText('eve@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('frank@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
  })

  it('filter by invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'grace@example.com')
    await addEntry(u, 'hank@example.com')
    await u.click(screen.getByRole('button', { name: /invite grace@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByText('grace@example.com')).toBeInTheDocument()
    expect(screen.queryByText('hank@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 entries')).toBeInTheDocument()
  })

  it('Invited count is unaffected by filter selection', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'ivy@example.com')
    await addEntry(u, 'jack@example.com')
    await u.click(screen.getByRole('button', { name: /invite ivy@example.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('Stats shows Total, Pending, Invited correctly (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'a@test.com', 'organic')
    await addEntry(u, 'b@test.com', 'referral')
    await u.click(screen.getByRole('button', { name: /invite a@test.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('Stats shows Invite rate as percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@test.com')
    await addEntry(u, 'y@test.com')
    await u.click(screen.getByRole('button', { name: /invite x@test.com/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 50%')).toBeInTheDocument()
  })

  it('Stats shows 0% invite rate with no entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('Stats shows per-source counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'o1@test.com', 'organic')
    await addEntry(u, 'o2@test.com', 'organic')
    await addEntry(u, 'r1@test.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('organic: 2')).toBeInTheDocument()
    expect(screen.getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('social: 0')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Waitlist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'persist@test.com', 'social')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('persist@test.com')).toBeInTheDocument()
  })

  it('source is stored correctly per entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'social@test.com', 'social')
    const li = screen.getByText('social@test.com').closest('li') as HTMLElement
    expect(within(li).getByText('social')).toBeInTheDocument()
  })

  it('filter all shows all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'aa@test.com')
    await addEntry(u, 'bb@test.com')
    await u.click(screen.getByRole('button', { name: /invite aa@test.com/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 2 entries')).toBeInTheDocument()
  })
})
