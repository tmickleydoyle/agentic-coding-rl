// HELD-OUT generalization tests — fresh scenarios and edge cases not in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Dev Handoff Checklist (held-out)', () => {
  it('Summary reflects a newly added item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write migration guide')
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary Completion is 50% when half of 4 items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Extra item')
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await u.click(screen.getByLabelText('Done: Update environment variables'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('removing a done item updates Completion correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await u.click(screen.getByLabelText('Done: Update environment variables'))
    // 2 done of 3 total = 67%
    await u.click(screen.getByRole('button', { name: 'Remove Write API documentation' }))
    // now 1 done of 2 total = 50%
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('removing all items one by one shows Completion: 0% and Remaining: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Write API documentation' }))
    await u.click(screen.getByRole('button', { name: 'Remove Update environment variables' }))
    await u.click(screen.getByRole('button', { name: 'Remove Tag release version' }))
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary shows correct stats after removing an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Tag release version' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Checklist Completion matches Summary Completion at all times', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Tag release version'))
    const checklistCompletion = screen.getByText(/Completion: \d+%/).textContent
    await nav(u, 'Summary')
    expect(screen.getByText(checklistCompletion!)).toBeInTheDocument()
  })

  it('items added after Clear all get correct ids and can be toggled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all' }))
    await nav(u, 'Checklist')
    await addItem(u, 'Fresh start item')
    await u.click(screen.getByLabelText('Done: Fresh start item'))
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })
})
