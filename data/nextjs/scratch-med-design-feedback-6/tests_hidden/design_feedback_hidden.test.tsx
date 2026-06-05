import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Design Feedback Tracker (held-out)', () => {
  it('heading shows open count of zero on first load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Open feedback (0)' })).toBeInTheDocument()
  })

  it('adding multiple items increments open count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note A', 'ScreenA')
    await addFeedback(u, 'Note B', 'ScreenB')
    await addFeedback(u, 'Note C', 'ScreenC')
    expect(screen.getByRole('heading', { name: /open feedback \(3\)/i })).toBeInTheDocument()
  })

  it('addressing all items reduces open count to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix A', 'Page1')
    await addFeedback(u, 'Fix B', 'Page2')
    await u.click(within(itemRow('Fix A')).getByRole('button', { name: /mark addressed Fix A/i }))
    await u.click(within(itemRow('Fix B')).getByRole('button', { name: /mark addressed Fix B/i }))
    expect(screen.getByRole('heading', { name: /open feedback \(0\)/i })).toBeInTheDocument()
  })

  it('Stats total stays correct after addressing items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'X')
    await addFeedback(u, 'Beta', 'X')
    await addFeedback(u, 'Gamma', 'X')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark addressed Alpha/i }))
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /mark addressed Beta/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 67%')).toBeInTheDocument()
  })

  it('Stats shows 100% when all items are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done1', 'Z')
    await addFeedback(u, 'Done2', 'Z')
    await u.click(within(itemRow('Done1')).getByRole('button', { name: /mark addressed Done1/i }))
    await u.click(within(itemRow('Done2')).getByRole('button', { name: /mark addressed Done2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Addressed: 100%')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('Show open only filter hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Visible', 'S1')
    await addFeedback(u, 'Hidden', 'S2')
    await u.click(within(itemRow('Hidden')).getByRole('button', { name: /mark addressed Hidden/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByText('Visible')).toBeInTheDocument()
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('toggling Show open only off brings addressed items back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'ReAppear', 'S')
    await u.click(within(itemRow('ReAppear')).getByRole('button', { name: /mark addressed ReAppear/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('ReAppear')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByText('ReAppear')).toBeInTheDocument()
  })

  it('Default to open only syncs filter and reflects in Feedback view checkbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Default to open only'))
    await nav(u, 'Feedback')
    expect(screen.getByLabelText('Show open only')).toBeChecked()
  })

  it('Default to open only can be toggled off again via Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Default to open only'))
    await u.click(screen.getByLabelText('Default to open only'))
    await nav(u, 'Feedback')
    expect(screen.getByLabelText('Show open only')).not.toBeChecked()
  })

  it('theme toggles back to light after two presses', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('addressed item badge shows addressed text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Check badge', 'Dashboard')
    await u.click(within(itemRow('Check badge')).getByRole('button', { name: /mark addressed Check badge/i }))
    expect(within(itemRow('Check badge')).getByText('addressed')).toBeInTheDocument()
  })

  it('Stats view is read-only and has no inputs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
