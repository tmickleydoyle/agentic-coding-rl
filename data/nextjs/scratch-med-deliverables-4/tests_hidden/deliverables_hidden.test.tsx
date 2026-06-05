// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2025-01-01') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function getRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('All heading increments as items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'First')
    expect(screen.getByRole('heading', { name: 'All (1)' })).toBeInTheDocument()
    await addItem(u, 'Second')
    expect(screen.getByRole('heading', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('due date is visible in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Budget report', '2024-09-15')
    expect(within(getRow('Budget report')).getByText('2024-09-15')).toBeInTheDocument()
  })

  it('Pending only count updates after marking item delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A')
    await addItem(u, 'B')
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.getByRole('heading', { name: 'Pending only (2)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    await u.click(within(getRow('A')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.getByRole('heading', { name: 'Pending only (1)' })).toBeInTheDocument()
  })

  it('marking back to pending increases Pending only count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'C')
    await u.click(within(getRow('C')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.getByRole('heading', { name: 'Pending only (0)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    await u.click(within(getRow('C')).getByRole('button', { name: /mark pending/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.getByRole('heading', { name: 'Pending only (1)' })).toBeInTheDocument()
  })

  it('Summary Pending count reflects delivered toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'D')
    await addItem(u, 'E')
    await u.click(within(getRow('D')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('E')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 100%')).toBeInTheDocument()
  })

  it('Summary Delivered 33% for one of three delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'R1')
    await addItem(u, 'R2')
    await addItem(u, 'R3')
    await u.click(within(getRow('R1')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 33%')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Stay')
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('heading', { name: 'Pending only (1)' })).toBeInTheDocument()
  })

  it('theme toggle can be reversed', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('delivered items still counted in Summary even when filter is Pending only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Hidden')
    await u.click(within(getRow('Hidden')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    // delivered item hidden in list
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })
})
