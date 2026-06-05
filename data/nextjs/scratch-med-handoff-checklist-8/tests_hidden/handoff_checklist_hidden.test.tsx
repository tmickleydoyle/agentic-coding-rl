// HELD-OUT generalization tests — different inputs, sequences, and edge cases.
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

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Dev Handoff Checklist (held-out)', () => {
  it('adding multiple new items increases Remaining correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Run migrations')
    await addItem(u, 'Notify stakeholders')
    expect(screen.getByText('Remaining: 5')).toBeInTheDocument()
  })

  it('marking all seeded items done shows Remaining 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done/i }))
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('deleting a done item reduces Summary Total and Done counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: /delete write readme/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary Pending equals Total minus Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Review PR')
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
  })

  it('filter Pending hides done items but Remaining count is unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Pending')
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
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

  it('completion rounds to 33% for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Archive repo')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('new item added after navigating back appears in All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    await addItem(u, 'Deploy to staging')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('deleting all items then adding one reflects in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete write readme/i }))
    await u.click(screen.getByRole('button', { name: /delete record demo video/i }))
    await u.click(screen.getByRole('button', { name: /delete archive repo/i }))
    await addItem(u, 'Final check')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('done filter shows newly marked item immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Check logs')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.queryByText('Check logs')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    await u.click(within(itemRow('Check logs')).getByRole('button', { name: /mark done/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Check logs')).toBeInTheDocument()
  })
})
