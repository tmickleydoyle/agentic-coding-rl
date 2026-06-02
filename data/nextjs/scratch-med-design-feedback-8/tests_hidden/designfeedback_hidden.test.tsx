// HELD-OUT generalization tests — fresh cross-view scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, scrn: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), scrn)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Design Feedback Tracker (held-out)', () => {
  it('adding three items shows Open: 3 and Total: 3 in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha issue', 'PageA')
    await addFeedback(u, 'Beta issue', 'PageB')
    await addFeedback(u, 'Gamma issue', 'PageC')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('addressing two of three gives 67% completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First', 'Home')
    await addFeedback(u, 'Second', 'Home')
    await addFeedback(u, 'Third', 'Home')
    await u.click(within(itemRow('First')).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(itemRow('Second')).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('deleting an addressed item updates Summary correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'To remove', 'Nav')
    await addFeedback(u, 'To keep', 'Nav')
    await u.click(within(itemRow('To remove')).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(itemRow('To remove')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Show open filter shows nothing when all items addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done A', 'X')
    await addFeedback(u, 'Done B', 'Y')
    await u.click(within(itemRow('Done A')).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(itemRow('Done B')).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.queryByText('Done A')).not.toBeInTheDocument()
    expect(screen.queryByText('Done B')).not.toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
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

  it('addressed count in Summary reflects toggle from addressed back to open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Flip me', 'Settings')
    await u.click(within(itemRow('Flip me')).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(itemRow('Flip me')).getByRole('button', { name: /mark open/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('clearing inputs after add feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Input clear test', 'Page')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Screen')).toHaveValue('')
  })

  it('multiple items same screen stored separately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First issue', 'Dashboard')
    await addFeedback(u, 'Second issue', 'Dashboard')
    expect(screen.getByText('First issue')).toBeInTheDocument()
    expect(screen.getByText('Second issue')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })
})
