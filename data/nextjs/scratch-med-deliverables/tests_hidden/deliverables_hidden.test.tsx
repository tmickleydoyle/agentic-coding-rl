import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2025-01-15') {
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function getRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('newly added item starts as pending in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Brand guidelines')
    expect(within(getRow('Brand guidelines')).getByText('pending')).toBeInTheDocument()
  })

  it('Showing count with Delivered filter after marking all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    await addItem(u, 'Prototype')
    await u.click(within(getRow('Wireframes')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('Prototype')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('Pending filter shows 0 items after all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deck')
    await u.click(within(getRow('Deck')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('Summary computes correct rounded progress for 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1')
    await addItem(u, 'P2')
    await addItem(u, 'P3')
    await u.click(within(getRow('P1')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('Summary reflects cross-view mark-delivered action', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Research')
    await addItem(u, 'Analysis')
    await u.click(within(getRow('Research')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
    await nav(u, 'Deliverables')
    await u.click(within(getRow('Analysis')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('due date is stored and displayed per item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Contract', '2024-03-15')
    expect(within(getRow('Contract')).getByText('2024-03-15')).toBeInTheDocument()
  })

  it('multiple items retain their individual statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft')
    await addItem(u, 'Final')
    await u.click(within(getRow('Final')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Draft')).getByText('pending')).toBeInTheDocument()
    expect(within(getRow('Final')).getByText('delivered')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Stay')
    await u.click(within(getRow('Stay')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('whitespace-only item name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })
})
