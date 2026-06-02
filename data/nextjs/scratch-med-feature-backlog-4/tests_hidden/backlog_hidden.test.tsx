// HELD-OUT generalization tests — different inputs, sequences, edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function featureRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

async function addFeature(u: U, title: string, priority = 'P0') {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog app (held-out)', () => {
  it('seed Dark mode feature already shows shipped status', () => {
    render(<App />)
    const row = featureRow('Dark mode')
    expect(within(row).getByText('shipped')).toBeInTheDocument()
    expect(within(row).getByText('P2')).toBeInTheDocument()
  })

  it('adding two P0 features makes Stats show P0: 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature X', 'P0')
    await addFeature(u, 'Feature Y', 'P0')
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
  })

  it('filter by P2 shows only Dark mode initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByText('Showing 1 of 3 features')).toBeInTheDocument()
    expect(screen.queryByText('OAuth login')).not.toBeInTheDocument()
    expect(screen.queryByText('CSV export')).not.toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('filter by P1 shows only CSV export initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByText('Showing 1 of 3 features')).toBeInTheDocument()
    expect(screen.getByText('CSV export')).toBeInTheDocument()
  })

  it('advancing OAuth login twice makes it shipped and Stats reflects it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    expect(within(featureRow('OAuth login')).getByText('shipped')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Idea: 0')).toBeInTheDocument()
  })

  it('deleting a shipped feature decreases Stats shipped count and pct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('Dark mode')).getByRole('button', { name: /delete dark mode/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0%')).toBeInTheDocument()
  })

  it('advancing CSV export (building) to shipped and checking 100% when all shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Advance OAuth login idea->building->shipped
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /advance oauth login/i }))
    // Advance CSV export building->shipped
    await u.click(within(featureRow('CSV export')).getByRole('button', { name: /advance csv export/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 100%')).toBeInTheDocument()
  })

  it('Showing count updates after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(featureRow('OAuth login')).getByRole('button', { name: /delete oauth login/i }))
    expect(screen.getByText('Showing 2 of 2 features')).toBeInTheDocument()
  })

  it('Showing count when filter active and item added outside filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    // add a P1 feature — should not appear in P0 filter
    await addFeature(u, 'New P1 thing', 'P1')
    expect(screen.getByText('Showing 1 of 4 features')).toBeInTheDocument()
  })

  it('theme toggle button text reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('Stats Building count decreases when feature is advanced past building', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    await nav(u, 'Backlog')
    await u.click(within(featureRow('CSV export')).getByRole('button', { name: /advance csv export/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Building: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })
})
