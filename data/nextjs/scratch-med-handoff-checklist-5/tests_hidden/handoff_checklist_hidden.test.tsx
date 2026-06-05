// HELD-OUT generalization tests — fresh scenarios and edge cases.
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

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Dev Handoff Checklist (held-out)', () => {
  it('all three seeded items start as Mark done (not done)', () => {
    render(<App />)
    const rows = screen.getAllByRole('button', { name: /mark done/i })
    expect(rows.length).toBe(3)
  })

  it('marking all three items done shows Completion: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Update README')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Tag the release')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Summary reflects 100% after all items done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Update README')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Tag the release')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('adding a new item increases Total items in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Notify stakeholders')
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 4')).toBeInTheDocument()
  })

  it('new item added then marked done updates Summary correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Archive repo')
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 25%')).toBeInTheDocument()
  })

  it('filter All shows all items after switching away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
    expect(screen.getByText('Update README')).toBeInTheDocument()
    expect(screen.getByText('Tag the release')).toBeInTheDocument()
  })

  it('filter Remaining hides done items but counts are still correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Update README')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Remaining')
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.queryByText('Update README')).not.toBeInTheDocument()
    expect(screen.getByText('Tag the release')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('deleting a done item recalculates completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Write release notes')).getByRole('button', { name: /delete write release notes/i }))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
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

  it('clear all then add new item shows Remaining: 1 and Completion: 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Checklist')
    await addItem(u, 'Fresh start')
    expect(screen.getByText('Fresh start')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })
})
