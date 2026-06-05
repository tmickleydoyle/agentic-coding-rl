import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText('Quarter'), quarter)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Roadmap Board app', () => {
  it('starts on the Roadmap view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /roadmap items \(3\)/i })).toBeInTheDocument()
  })

  it('shows all three seeded items on initial load', () => {
    render(<App />)
    expect(screen.getByText('Launch billing')).toBeInTheDocument()
    expect(screen.getByText('API v2')).toBeInTheDocument()
    expect(screen.getByText('Mobile app')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Roadmap', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByRole('heading', { name: /roadmap items/i })).toBeInTheDocument()
  })

  it('adds a new item with planned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Dark mode', 'Q4')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /roadmap items \(4\)/i })).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /roadmap items \(3\)/i })).toBeInTheDocument()
  })

  it('marks a planned item in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app in-progress/i }))
    expect(within(itemRow('Mobile app')).getByText('in-progress')).toBeInTheDocument()
  })

  it('mark in-progress is disabled for already in-progress item', () => {
    render(<App />)
    expect(
      within(itemRow('API v2')).getByRole('button', { name: /mark api v2 in-progress/i })
    ).toBeDisabled()
  })

  it('mark in-progress is disabled for shipped item', () => {
    render(<App />)
    expect(
      within(itemRow('Launch billing')).getByRole('button', { name: /mark launch billing in-progress/i })
    ).toBeDisabled()
  })

  it('marks an item shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('API v2')).getByRole('button', { name: /mark api v2 shipped/i }))
    expect(within(itemRow('API v2')).getByText('shipped')).toBeInTheDocument()
  })

  it('mark shipped is disabled for already shipped item', () => {
    render(<App />)
    expect(
      within(itemRow('Launch billing')).getByRole('button', { name: /mark launch billing shipped/i })
    ).toBeDisabled()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Mobile app')).getByRole('button', { name: /delete mobile app/i }))
    expect(screen.queryByText('Mobile app')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /roadmap items \(2\)/i })).toBeInTheDocument()
  })

  it('filters by quarter hides non-matching items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.getByRole('heading', { name: /roadmap items \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Launch billing')).toBeInTheDocument()
    expect(screen.queryByText('API v2')).not.toBeInTheDocument()
  })

  it('filter All restores all items in heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'All')
    expect(screen.getByRole('heading', { name: /roadmap items \(3\)/i })).toBeInTheDocument()
  })

  it('Stats shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('Stats shows Shipped this quarter count for Q2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped this quarter: 0')).toBeInTheDocument()
  })

  it('Stats updates when an item is shipped (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('API v2')).getByRole('button', { name: /mark api v2 shipped/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped this quarter: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
  })

  it('Stats does not count filtered-out items differently — uses all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating back to Roadmap', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Roadmap')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset all items clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Roadmap')
    expect(screen.getByRole('heading', { name: /roadmap items \(0\)/i })).toBeInTheDocument()
  })

  it('Stats shows zeros after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped this quarter: 0')).toBeInTheDocument()
  })
})
