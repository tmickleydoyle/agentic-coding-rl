// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Dev Handoff Checklist (held-out)', () => {
  it('Summary shows 0% completion with no items after clearing all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Record demo video done'))
    await u.click(screen.getByLabelText('Mark Hand off credentials done'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Remaining on Checklist updates after clearing done items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Record demo video done'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('adding multiple items increases Total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    const newItems = ['Set up CI', 'Review PR', 'Notify stakeholders']
    for (const item of newItems) {
      await u.clear(screen.getByLabelText(/new item/i))
      await u.type(screen.getByLabelText(/new item/i), item)
      await u.click(screen.getByRole('button', { name: /add item/i }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 6')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 6')).toBeInTheDocument()
  })

  it('completion rounds to 33% for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write README done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('re-enabling Show done items restores hidden items on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Record demo video done'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show done items/i)) // hide
    await u.click(screen.getByLabelText(/show done items/i)) // show again
    await nav(u, 'Checklist')
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('toggling theme back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('clearing done when nothing is done leaves all items intact', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
    expect(screen.getByText('Hand off credentials')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('Summary Remaining equals Total minus Done after several toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Extra task')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await u.click(screen.getByLabelText('Mark Write README done'))
    await u.click(screen.getByLabelText('Mark Extra task done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })
})
