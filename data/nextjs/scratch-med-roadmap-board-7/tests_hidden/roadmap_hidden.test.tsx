// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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

describe('Roadmap Board (held-out)', () => {
  it('adding a Q2 item and shipping it increments Shipped this quarter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'New feature', 'Q2')
    await u.click(within(itemRow('New feature')).getByRole('button', { name: /mark new feature shipped/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped this quarter: 1')).toBeInTheDocument()
  })

  it('filter Q3 shows only Mobile app from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q3')
    expect(screen.getByRole('heading', { name: /roadmap items \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Mobile app')).toBeInTheDocument()
    expect(screen.queryByText('Launch billing')).not.toBeInTheDocument()
    expect(screen.queryByText('API v2')).not.toBeInTheDocument()
  })

  it('filter Q4 shows no items from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByRole('heading', { name: /roadmap items \(0\)/i })).toBeInTheDocument()
  })

  it('adding two Q1 items and filtering shows correct heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Redesign', 'Q1')
    await addItem(u, 'Analytics', 'Q1')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.getByRole('heading', { name: /roadmap items \(3\)/i })).toBeInTheDocument()
  })

  it('Stats In Progress count updates after marking planned as in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app in-progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 2')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
  })

  it('deleting shipped item reduces Shipped in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Launch billing')).getByRole('button', { name: /delete launch billing/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('mark shipped button disabled after marking in-progress then shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app in-progress/i }))
    await u.click(within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app shipped/i }))
    expect(
      within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app shipped/i })
    ).toBeDisabled()
    expect(
      within(itemRow('Mobile app')).getByRole('button', { name: /mark mobile app in-progress/i })
    ).toBeDisabled()
  })

  it('roadmap state preserved when navigating to Stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persist me', 'Q2')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('reset clears items and Stats shows all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped this quarter: 0')).toBeInTheDocument()
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
})
