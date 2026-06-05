import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('shows Open: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
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

  it('adds a feedback item and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button too small', 'Checkout')
    expect(screen.getByText('Button too small')).toBeInTheDocument()
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })

  it('new item starts with Open status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Color contrast issue', 'Login')
    const li = screen.getByText('Color contrast issue').closest('li') as HTMLElement
    expect(within(li).getByText('Open')).toBeInTheDocument()
  })

  it('ignores submission when Note is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('ignores submission when Screen is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Something broken')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('open count increments when items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note A', 'Screen A')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    await addFeedback(u, 'Note B', 'Screen B')
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('marks an item as addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix header', 'Dashboard')
    const li = screen.getByText('Fix header').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    expect(within(li).getByText('Addressed')).toBeInTheDocument()
  })

  it('open count decrements after marking addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix nav', 'Nav')
    const li = screen.getByText('Fix nav').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('reopens an addressed item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Spacing issue', 'Profile')
    const li = screen.getByText('Spacing issue').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(li).getByRole('button', { name: /reopen/i }))
    expect(within(li).getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('filters to open only hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue alpha', 'Page A')
    await addFeedback(u, 'Issue beta', 'Page B')
    const li = screen.getByText('Issue alpha').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /open only/i }))
    expect(screen.queryByText('Issue alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Issue beta')).toBeInTheDocument()
  })

  it('open count is still correct when filter is Open only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item one', 'Screen 1')
    await addFeedback(u, 'Item two', 'Screen 2')
    const li = screen.getByText('Item one').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /open only/i }))
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('All filter restores addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done item', 'Settings')
    const li = screen.getByText('Done item').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /open only/i }))
    await u.click(screen.getByRole('button', { name: /^All$/i }))
    expect(screen.getByText('Done item')).toBeInTheDocument()
  })

  it('Summary shows correct stats (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note 1', 'S1')
    await addFeedback(u, 'Note 2', 'S2')
    await addFeedback(u, 'Note 3', 'S3')
    const li = screen.getByText('Note 1').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 33%')).toBeInTheDocument()
  })

  it('Summary shows 0% addressed rate with no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Only item', 'Screen X')
    const li = screen.getByText('Only item').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 100%')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Feedback')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('feedback state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persisted note', 'Persist screen')
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persisted note')).toBeInTheDocument()
  })
})
