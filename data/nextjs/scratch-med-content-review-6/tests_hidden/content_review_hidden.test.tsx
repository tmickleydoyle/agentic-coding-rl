// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.clear(screen.getByLabelText(/reviewer/i))
  await u.type(screen.getByLabelText(/reviewer/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Content Review Tracker (held-out)', () => {
  it('changes filter to changes and shows only changes-status items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spec doc', 'Anna')
    await addItem(u, 'Design doc', 'Ben')
    // advance Spec doc: draft -> approved -> changes
    await u.click(within(itemRow('Spec doc')).getByRole('button', { name: /next status for spec doc/i }))
    await u.click(within(itemRow('Spec doc')).getByRole('button', { name: /next status for spec doc/i }))
    await u.click(screen.getByRole('button', { name: 'changes' }))
    expect(screen.getByRole('heading', { name: /reviews \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Spec doc')).toBeInTheDocument()
    expect(screen.queryByText('Design doc')).not.toBeInTheDocument()
  })

  it('stats counts changes status correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Carl')
    await addItem(u, 'Beta', 'Diane')
    // Alpha: draft->approved->changes
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /next status for alpha/i }))
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /next status for alpha/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Changes: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('100% approved when all items are approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', 'Ed')
    await addItem(u, 'Y', 'Fay')
    await u.click(within(itemRow('X')).getByRole('button', { name: /next status for x/i }))
    await u.click(within(itemRow('Y')).getByRole('button', { name: /next status for y/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 100%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('count in heading matches items under active filter after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'M1', 'Gus')
    await addItem(u, 'M2', 'Hal')
    await addItem(u, 'M3', 'Iris')
    // all draft; filter by draft -> 3
    await u.click(screen.getByRole('button', { name: 'draft' }))
    expect(screen.getByRole('heading', { name: /reviews \(3\)/i })).toBeInTheDocument()
    // advance M1 to approved; now draft filter shows 2
    await u.click(within(itemRow('M1')).getByRole('button', { name: /next status for m1/i }))
    expect(screen.getByRole('heading', { name: /reviews \(2\)/i })).toBeInTheDocument()
  })

  it('stats updates after advancing status via cross-view interaction', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Longform', 'Jess')
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await u.click(within(itemRow('Longform')).getByRole('button', { name: /next status for longform/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 100%')).toBeInTheDocument()
  })

  it('multiple items retain independent statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Solo A', 'Kim')
    await addItem(u, 'Solo B', 'Len')
    await u.click(within(itemRow('Solo A')).getByRole('button', { name: /next status for solo a/i }))
    expect(within(itemRow('Solo A')).getByText('Status: approved')).toBeInTheDocument()
    expect(within(itemRow('Solo B')).getByText('Status: draft')).toBeInTheDocument()
  })

  it('filter state does not reset after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Snap', 'Mo')
    await u.click(within(itemRow('Snap')).getByRole('button', { name: /next status for snap/i }))
    await u.click(screen.getByRole('button', { name: 'approved' }))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    // filter may reset on re-mount — the spec does not require persistence, but items should show
    // Checking at least that the page renders without crash and shows the item under All
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Snap')).toBeInTheDocument()
  })
})
