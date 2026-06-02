import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source?: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  if (source) {
    await u.selectOptions(screen.getByLabelText('Source'), source)
  }
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entries (0)' })).toBeInTheDocument()
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

  it('navigates back to Waitlist after visiting other views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('adds an entry and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'alice@example.com', 'organic')
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('heading', { name: 'Entries (0)' })).toBeInTheDocument()
  })

  it('ignores a duplicate email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dup@example.com')
    await addEntry(u, 'dup@example.com')
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
  })

  it('shows pending status badge on new entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'bob@example.com')
    const li = screen.getByText('bob@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('pending')).toBeInTheDocument()
  })

  it('invite button changes status to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'carol@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite carol@example.com' }))
    const li = screen.getByText('carol@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('invited')).toBeInTheDocument()
  })

  it('invite button is disabled after inviting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite dave@example.com' }))
    expect(screen.getByRole('button', { name: 'Invite dave@example.com' })).toBeDisabled()
  })

  it('filter by pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'e1@example.com')
    await addEntry(u, 'e2@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite e1@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.queryByText('e1@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('e2@example.com')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
  })

  it('filter by invited hides pending entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'f1@example.com')
    await addEntry(u, 'f2@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite f1@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByText('f1@example.com')).toBeInTheDocument()
    expect(screen.queryByText('f2@example.com')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
  })

  it('filter all shows every entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'g1@example.com')
    await addEntry(u, 'g2@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite g1@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Entries (2)' })).toBeInTheDocument()
  })

  it('Stats shows zeros when no entries (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Invited rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects entries added on Waitlist (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'h1@example.com', 'referral')
    await addEntry(u, 'h2@example.com', 'social')
    await u.click(screen.getByRole('button', { name: 'Invite h1@example.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Invited rate: 50%')).toBeInTheDocument()
  })

  it('Stats shows per-source counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'i1@example.com', 'organic')
    await addEntry(u, 'i2@example.com', 'organic')
    await addEntry(u, 'i3@example.com', 'referral')
    await nav(u, 'Stats')
    expect(screen.getByText('organic: 2')).toBeInTheDocument()
    expect(screen.getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('social: 0')).toBeInTheDocument()
  })

  it('Stats ignores active filter — counts all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'j1@example.com')
    await addEntry(u, 'j2@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite j1@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists data-theme across views', async () => {
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

  it('invited rate rounds correctly for 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'k1@example.com')
    await addEntry(u, 'k2@example.com')
    await addEntry(u, 'k3@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite k1@example.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited rate: 33%')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'l1@example.com')
    await addEntry(u, 'l2@example.com')
    await u.click(screen.getByRole('button', { name: 'Invite l1@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Entries (1)' })).toBeInTheDocument()
    expect(screen.getByText('l1@example.com')).toBeInTheDocument()
    expect(screen.queryByText('l2@example.com')).not.toBeInTheDocument()
  })

  it('source is shown in the entry row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'src@example.com', 'social')
    const li = screen.getByText('src@example.com').closest('li') as HTMLElement
    expect(within(li).getByText('social')).toBeInTheDocument()
  })
})
