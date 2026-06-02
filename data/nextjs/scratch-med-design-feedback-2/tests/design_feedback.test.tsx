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

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('shows Feedback (0) in nav initially', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
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

  it('adds a feedback item and shows it formatted correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button misaligned', 'Login')
    expect(screen.getByText('"Button misaligned" on Login')).toBeInTheDocument()
  })

  it('new item has status open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Contrast issue', 'Dashboard')
    const items = screen.getByRole('list')
    expect(within(items).getByText('Status: open')).toBeInTheDocument()
  })

  it('ignores feedback with blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('ignores feedback with blank screen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Something wrong')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('marks an item as addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Font too small', 'Profile')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByText('Status: addressed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mark open/i })).toBeInTheDocument()
  })

  it('marks an addressed item back to open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Wrong color', 'Header')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /mark open/i }))
    expect(screen.getByText('Status: open')).toBeInTheDocument()
  })

  it('open count in nav updates when item is addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Missing icon', 'Sidebar')
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('filter button starts as Show: All', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: All' })).toBeInTheDocument()
  })

  it('toggling filter to Show: Open hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue A', 'Screen1')
    await addFeedback(u, 'Issue B', 'Screen2')
    const items = screen.getAllByRole('listitem')
    await u.click(within(items[0]).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Open' })).toBeInTheDocument()
    expect(screen.queryByText('"Issue A" on Screen1')).not.toBeInTheDocument()
    expect(screen.getByText('"Issue B" on Screen2')).toBeInTheDocument()
  })

  it('toggling filter back to Show: All restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'View1')
    await addFeedback(u, 'Beta', 'View2')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await u.click(screen.getByRole('button', { name: 'Show: Open' }))
    expect(screen.getByText('"Alpha" on View1')).toBeInTheDocument()
    expect(screen.getByText('"Beta" on View2')).toBeInTheDocument()
  })

  it('Summary shows zeros when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added items and their statuses (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Spacing off', 'Cart')
    await addFeedback(u, 'Color wrong', 'Checkout')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('Summary progress rounds correctly for a third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'A')
    await addFeedback(u, 'Two', 'B')
    await addFeedback(u, 'Three', 'C')
    const lis = screen.getAllByRole('listitem')
    await u.click(within(lis[0]).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Feedback (0)')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away from Feedback and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persisted note', 'SomePage')
    await nav(u, 'Summary')
    await nav(u, /feedback/i)
    expect(screen.getByText('"Persisted note" on SomePage')).toBeInTheDocument()
  })

  it('multiple items all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First', 'PageA')
    await addFeedback(u, 'Second', 'PageB')
    await addFeedback(u, 'Third', 'PageC')
    expect(screen.getByText('"First" on PageA')).toBeInTheDocument()
    expect(screen.getByText('"Second" on PageB')).toBeInTheDocument()
    expect(screen.getByText('"Third" on PageC')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback (3)' })).toBeInTheDocument()
  })
})
