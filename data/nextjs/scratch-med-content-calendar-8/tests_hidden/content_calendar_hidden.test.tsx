// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
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

async function addItem(u: U, title: string, platform?: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  if (platform) {
    await u.selectOptions(screen.getByLabelText('Platform'), platform)
  }
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Content Calendar (held-out)', () => {
  it('newly added item appears in Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Promo video', 'Instagram')
    await addItem(u, 'AMA thread', 'Twitter')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
  })

  it('promoting a draft to scheduled updates Scheduled count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Behind the scenes')).getByRole('button', { name: /set scheduled/i }))
    await u.click(within(itemRow('Launch post')).getByRole('button', { name: /set scheduled/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
  })

  it('scheduled percentage rounds correctly for 2 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Behind the scenes')).getByRole('button', { name: /set scheduled/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 67%')).toBeInTheDocument()
  })

  it('scheduled percentage is 100% when all items are scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Launch post')).getByRole('button', { name: /set scheduled/i }))
    await u.click(within(itemRow('Behind the scenes')).getByRole('button', { name: /set scheduled/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 100%')).toBeInTheDocument()
  })

  it('filter by draft shows correct count after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Behind the scenes')).getByRole('button', { name: /set scheduled/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('filter by published shows added item after publishing it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Case study', 'Blog')
    await u.click(within(itemRow('Case study')).getByRole('button', { name: /set published/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Case study')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('platform is shown on each item row', () => {
    render(<App />)
    expect(within(itemRow('Launch post')).getByText('Twitter')).toBeInTheDocument()
    expect(within(itemRow('Product update')).getByText('LinkedIn')).toBeInTheDocument()
    expect(within(itemRow('Behind the scenes')).getByText('Instagram')).toBeInTheDocument()
  })

  it('theme toggle goes back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('adding multiple items one after another increments Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'First extra')
    await addItem(u, 'Second extra')
    expect(screen.getByText('Showing: 5 items')).toBeInTheDocument()
  })

  it('Stats Draft count matches after multiple status updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft A')
    await addItem(u, 'Draft B')
    await u.click(within(itemRow('Draft A')).getByRole('button', { name: /set published/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
  })
})
