// HELD-OUT generalization tests — fresh scenarios and edge cases not covered by the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, email: string, source: string) {
  await u.clear(screen.getByLabelText('Email'))
  await u.type(screen.getByLabelText('Email'), email)
  await u.clear(screen.getByLabelText('Source'))
  await u.type(screen.getByLabelText('Source'), source)
  await u.click(screen.getByRole('button', { name: /add to waitlist/i }))
}

describe('Waitlist Manager (held-out)', () => {
  it('carol row does not have an Invite button because she is seeded as invited', () => {
    render(<App />)
    const li = screen.getByText('carol@example.com').closest('li') as HTMLElement
    expect(within(li).queryByRole('button', { name: /^invite$/i })).not.toBeInTheDocument()
  })

  it('alice row has an Invite button because she is seeded as pending', () => {
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: /^invite$/i })).toBeInTheDocument()
  })

  it('inviting alice removes her Invite button and shows invited text', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /^invite$/i }))
    expect(within(li).getByText('invited')).toBeInTheDocument()
    expect(within(li).queryByRole('button', { name: /^invite$/i })).not.toBeInTheDocument()
  })

  it('inviting bob updates the summary line correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('bob@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /^invite$/i }))
    expect(screen.getByText('Total: 3 | Invited: 2')).toBeInTheDocument()
  })

  it('Pending filter after inviting alice hides alice', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /^invite$/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('Invited filter after inviting alice shows both alice and carol', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('alice@example.com').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /^invite$/i }))
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
    expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
  })

  it('adding entries with same source increments that source count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'x@example.com', 'Twitter')
    await addEntry(u, 'y@example.com', 'Twitter')
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 4')).toBeInTheDocument()
  })

  it('Stats Pending count decreases after an invite', async () => {
    const u = userEvent.setup()
    render(<App />)
    const inviteButtons = screen.getAllByRole('button', { name: /^invite$/i })
    await u.click(inviteButtons[0])
    await nav(u, 'Stats')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('filter switch back to All shows all entries again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('new entry appears in Pending filter immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'zara@example.com', 'Dribbble')
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('zara@example.com')).toBeInTheDocument()
  })

  it('new entry does not appear in Invited filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'zara@example.com', 'Dribbble')
    await u.click(screen.getByRole('button', { name: 'Invited' }))
    expect(screen.queryByText('zara@example.com')).not.toBeInTheDocument()
  })

  it('Stats shows new source added after initial load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'q@example.com', 'HackerNews')
    await nav(u, 'Stats')
    expect(screen.getByText('HackerNews: 1')).toBeInTheDocument()
    expect(screen.getByText('Total signups: 4')).toBeInTheDocument()
  })

  it('theme toggle persists after going to Waitlist and back to Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Waitlist')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('invite rate is 100% when all three seeded entries are invited', async () => {
    const u = userEvent.setup()
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: /^invite$/i })
    for (const btn of buttons) {
      await u.click(btn)
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Invite rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })
})
