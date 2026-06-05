// HELD-OUT generalization tests — different inputs and sequences not seen during generation.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Handoff Checklist (held-out)', () => {
  it('completion is 0% with no items after removing all seeded ones', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /remove write documentation/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /remove record demo video/i }))
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /remove hand off credentials/i }))
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary shows 0% completion and 0 total after removing all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /remove write documentation/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /remove record demo video/i }))
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /remove hand off credentials/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('adding a new item and marking it done updates Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Tag release')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await u.click(within(itemRow('Tag release')).getByRole('button', { name: /mark done tag release/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('re-enabling Show done items restores hidden items in Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /mark done hand off credentials/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i))
    await u.click(screen.getByLabelText(/show done items/i))
    await nav(u, 'Checklist')
    expect(screen.getByText('Hand off credentials')).toBeInTheDocument()
  })

  it('marking all seeded items done shows Completion: 100% in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write documentation')).getByRole('button', { name: /mark done write documentation/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await u.click(within(itemRow('Hand off credentials')).getByRole('button', { name: /mark done hand off credentials/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('input clears after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/new item/i) as HTMLInputElement
    await u.type(input, 'Check env vars')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(input.value).toBe('')
  })

  it('whitespace-only title is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), '   ')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })
})
