// HELD-OUT generalization tests — fresh scenarios not seen during generation.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Handoff Checklist (held-out)', () => {
  it('adding two items brings Remaining to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Notify QA team')
    await addItem(u, 'Archive old branch')
    expect(screen.getByText('Remaining: 5')).toBeInTheDocument()
  })

  it('completing two of four items shows Completion: 50%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Extra task')
    await u.click(screen.getByLabelText('Done: Write README'))
    await u.click(screen.getByLabelText('Done: Extra task'))
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Summary Completed count updates after clearing completed via Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Update API docs'))
    await u.click(screen.getByLabelText('Done: Record demo video'))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear completed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('removing a done item recalculates percentage correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write README'))
    // 1 done out of 3 = 33%
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /remove write readme/i }))
    // now 0 done out of 2 = 0%
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Summary Remaining matches Checklist Remaining after add and done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Final check')
    await u.click(screen.getByLabelText('Done: Final check'))
    await nav(u, 'Summary')
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('whitespace-only item title is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), '   ')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('input is cleared after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Test item')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByLabelText(/new item/i)).toHaveValue('')
  })
})
