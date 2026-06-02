import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string | RegExp) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker (held-out)', () => {
  it('inputs are cleared after adding feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Clear me', 'Onboarding')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Screen')).toHaveValue('')
  })

  it('open count reflects all currently open items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'X', 'P1')
    await addFeedback(u, 'Y', 'P2')
    await addFeedback(u, 'Z', 'P3')
    expect(screen.getByRole('button', { name: 'Feedback (3)' })).toBeInTheDocument()
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[1]).getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByRole('button', { name: 'Feedback (2)' })).toBeInTheDocument()
  })

  it('marking all items addressed gives Progress: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix A', 'ScreenA')
    await addFeedback(u, 'Fix B', 'ScreenB')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(lis[1]).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
  })

  it('Show: Open filter with no open items shows empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done one', 'Screen1')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('Summary Total updates as items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    await nav(u, /feedback/i)
    await addFeedback(u, 'New item', 'Dash')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('ignores feedback when both fields are blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('filter state persists when navigating to another view and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Keep open', 'PageX')
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Open' })).toBeInTheDocument()
    await nav(u, 'Summary')
    await nav(u, /feedback/i)
    expect(screen.getByRole('button', { name: 'Show: Open' })).toBeInTheDocument()
  })

  it('item text format is correct with special characters in note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Color #fff too bright', 'Hero')
    expect(screen.getByText('"Color #fff too bright" on Hero')).toBeInTheDocument()
  })

  it('each item independently tracks its own status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'ItemOne', 'S1')
    await addFeedback(u, 'ItemTwo', 'S2')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    expect(within(lis[0]).getByText('Status: addressed')).toBeInTheDocument()
    expect(within(lis[1]).getByText('Status: open')).toBeInTheDocument()
  })

  it('open count in nav is visible from Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue', 'Pg')
    await nav(u, 'Summary')
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
    const lis_check = screen.queryAllByRole('listitem')
    expect(lis_check.length).toBe(0)
  })

  it('theme toggle label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })
})
