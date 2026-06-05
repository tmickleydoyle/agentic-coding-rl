import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screen_: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.type(screen.getByLabelText('Screen'), screen_)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('shows Open feedback (0) with no items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Open feedback (0)' })).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Feedback view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('adds a feedback item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button color is off', 'Login')
    expect(screen.getByText('Button color is off')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('increments open count after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Font too small', 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Open feedback (1)' })).toBeInTheDocument()
  })

  it('ignores a blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Open feedback (0)' })).toBeInTheDocument()
  })

  it('ignores a blank screen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Something is wrong')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Open feedback (0)' })).toBeInTheDocument()
  })

  it('new item has status open and shows Mark addressed button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Contrast issue', 'Profile')
    expect(within(itemRow('Contrast issue')).getByText('open')).toBeInTheDocument()
    expect(within(itemRow('Contrast issue')).getByRole('button', { name: /mark addressed contrast issue/i })).toBeInTheDocument()
  })

  it('marking an item addressed changes its status and hides the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Padding wrong', 'Checkout')
    await u.click(within(itemRow('Padding wrong')).getByRole('button', { name: /mark addressed padding wrong/i }))
    expect(within(itemRow('Padding wrong')).getByText('addressed')).toBeInTheDocument()
    expect(within(itemRow('Padding wrong')).queryByRole('button', { name: /mark addressed/i })).not.toBeInTheDocument()
  })

  it('open count decrements when an item is addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Icon misaligned', 'Nav')
    await addFeedback(u, 'Wrong font', 'Header')
    await u.click(within(itemRow('Icon misaligned')).getByRole('button', { name: /mark addressed icon misaligned/i }))
    expect(screen.getByRole('heading', { name: 'Open feedback (1)' })).toBeInTheDocument()
  })

  it('Show open only filter hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fixed item', 'Home')
    await addFeedback(u, 'Open item', 'About')
    await u.click(within(itemRow('Fixed item')).getByRole('button', { name: /mark addressed fixed item/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Fixed item')).not.toBeInTheDocument()
    expect(screen.getByText('Open item')).toBeInTheDocument()
  })

  it('open count heading stays correct while filter is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note A', 'Screen A')
    await addFeedback(u, 'Note B', 'Screen B')
    await u.click(within(itemRow('Note A')).getByRole('button', { name: /mark addressed note a/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByRole('heading', { name: 'Open feedback (1)' })).toBeInTheDocument()
  })

  it('unchecking filter shows all items again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done note', 'Done screen')
    await u.click(within(itemRow('Done note')).getByRole('button', { name: /mark addressed done note/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Done note')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByText('Done note')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Feedback 1', 'Page 1')
    await addFeedback(u, 'Feedback 2', 'Page 2')
    await u.click(within(itemRow('Feedback 1')).getByRole('button', { name: /mark addressed feedback 1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 50%')).toBeInTheDocument()
  })

  it('Summary shows 0% rate with no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Only item', 'Only screen')
    await u.click(within(itemRow('Only item')).getByRole('button', { name: /mark addressed only item/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 100%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Feedback')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('feedback list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Persistent screen')
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
  })
})
