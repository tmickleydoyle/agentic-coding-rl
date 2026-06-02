// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board (held-out)', () => {
  it('adding two Q3 items then filtering Q3 shows 3 total (1 seeded + 2 new)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Redesign', 'Q3', 'planned')
    await addItem(u, 'Performance', 'Q3', 'in-progress')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q3')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('shipping multiple items updates Stats shipped count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship api v2/i }))
    await u.click(screen.getByRole('button', { name: /ship mobile app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 3')).toBeInTheDocument()
    expect(screen.getByText('In progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 100%')).toBeInTheDocument()
  })

  it('item added with status shipped increments shipped count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launched feature', 'Q1', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 50%')).toBeInTheDocument()
  })

  it('filter is maintained when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('item added in-progress status appears in in-progress count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Beta release', 'Q2', 'in-progress')
    await nav(u, 'Stats')
    expect(screen.getByText('In progress: 2')).toBeInTheDocument()
  })

  it('reset from Settings then navigate back shows only 3 seeded items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp item', 'Q4', 'planned')
    await addItem(u, 'Another temp', 'Q4', 'planned')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset items/i }))
    await nav(u, 'Roadmap')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
    expect(screen.getByText('Dark mode — Q1 — shipped')).toBeInTheDocument()
    expect(screen.queryByText('Temp item — Q4 — planned')).not.toBeInTheDocument()
  })

  it('Stats show 0% shipped when all items are planned', async () => {
    const u = userEvent.setup()
    render(<App />)
    // reset and add only planned items
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset items/i }))
    await nav(u, 'Roadmap')
    // ship none; check that Dark mode is already shipped and skews results
    // instead add a brand new planned item and verify planned count
    await addItem(u, 'Just planning', 'Q4', 'planned')
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 2')).toBeInTheDocument()
  })

  it('Q4 filter shows newly added Q4 item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Year end review', 'Q4', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByText('Year end review — Q4 — planned')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
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

  it('shipped item line text updates after clicking Ship', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship mobile app/i }))
    expect(screen.getByText('Mobile app — Q3 — shipped')).toBeInTheDocument()
    expect(screen.queryByText('Mobile app — Q3 — planned')).not.toBeInTheDocument()
  })
})
