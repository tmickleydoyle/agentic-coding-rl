import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.selectOptions(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

function entryRow(email: string): HTMLElement {
  const li = screen.getByText(email).closest('li')
  if (!li) throw new Error(`no row for ${email}`)
  return li as HTMLElement
}

describe('Waitlist Manager app', () => {
  it('starts on the Waitlist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('shows seed data on load', () => {
    render(<App />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('shows invited banner with seed data', () => {
    render(<App />)
    expect(screen.getByText('Invited: 0 of 3')).toBeInTheDocument()
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

  it('navigates back to Waitlist view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByRole('heading', { name: 'Waitlist' })).toBeInTheDocument()
  })

  it('adds a new entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'dave@example.com', 'referral')
    expect(screen.getByText('dave@example.com')).toBeInTheDocument()
    expect(screen.getByText('Invited: 0 of 4')).toBeInTheDocument()
  })

  it('ignores a blank email', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Invited: 0 of 3')).toBeInTheDocument()
  })

  it('new entry starts as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'eve@example.com', 'other')
    expect(within(entryRow('eve@example.com')).getByText('pending')).toBeInTheDocument()
  })

  it('invite button changes status to invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    expect(within(entryRow('alice@example.com')).getByText('invited')).toBeInTheDocument()
  })

  it('invite button is disabled after inviting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    expect(screen.getByRole('button', { name: 'Invite alice@example.com' })).toBeDisabled()
  })

  it('invited banner updates after invite', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    expect(screen.getByText('Invited: 1 of 3')).toBeInTheDocument()
  })

  it('filter by pending hides invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('filter by invited shows only invited entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite bob@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
  })

  it('invited banner is correct regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'pending')
    expect(screen.getByText('Invited: 1 of 3')).toBeInTheDocument()
  })

  it('Stats view shows correct totals with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    expect(screen.getByText('Invited: 0')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 0%')).toBeInTheDocument()
  })

  it('Stats view updates after an invite (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Invite alice@example.com' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Invited: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Invite rate: 33%')).toBeInTheDocument()
  })

  it('Stats view shows source counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).getByText('twitter: 2')).toBeInTheDocument()
    expect(within(bySource).getByText('linkedin: 1')).toBeInTheDocument()
  })

  it('Stats view does not show source with zero entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).queryByText(/referral/)).not.toBeInTheDocument()
    expect(within(bySource).queryByText(/other/)).not.toBeInTheDocument()
  })

  it('Stats source count updates after adding an entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'frank@example.com', 'referral')
    await nav(u, 'Stats')
    const bySource = screen.getByRole('region', { name: 'By source' })
    expect(within(bySource).getByText('referral: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists it', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves waitlist state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'grace@example.com', 'other')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByText('grace@example.com')).toBeInTheDocument()
  })

  it('filter selection persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'invited')
    await nav(u, 'Stats')
    await nav(u, 'Waitlist')
    expect(screen.getByLabelText('Filter by status')).toHaveValue('invited')
  })
})
