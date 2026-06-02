import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, title: string) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}
function featureRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Feature Backlog (held-out)', () => {
  it('resetting filter to All shows all features again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Item one')
    await addFeature(u, 'Item two')
    const r = featureRow('Item one')
    await u.selectOptions(within(r).getByLabelText(/Priority for Item one/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('deleting all features shows Showing: 0 of 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Zap me')
    await addFeature(u, 'Zap me too')
    await u.click(screen.getByRole('button', { name: /delete zap me$/i }))
    await u.click(screen.getByRole('button', { name: /delete zap me too/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('Stats Shipped rate rounds correctly for two of three shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'S1')
    await addFeature(u, 'S2')
    await addFeature(u, 'S3')
    const r1 = featureRow('S1')
    await u.selectOptions(within(r1).getByLabelText(/Status for S1/i), 'shipped')
    const r2 = featureRow('S2')
    await u.selectOptions(within(r2).getByLabelText(/Status for S2/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 67%')).toBeInTheDocument()
  })

  it('filter by status building shows only building features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Concept')
    await addFeature(u, 'In flight')
    await addFeature(u, 'Live')
    const rB = featureRow('In flight')
    await u.selectOptions(within(rB).getByLabelText(/Status for In flight/i), 'building')
    const rS = featureRow('Live')
    await u.selectOptions(within(rS).getByLabelText(/Status for Live/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'building')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('In flight')).toBeInTheDocument()
    expect(screen.queryByText('Concept')).not.toBeInTheDocument()
    expect(screen.queryByText('Live')).not.toBeInTheDocument()
  })

  it('Stats updates immediately after adding a feature (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 0')).toBeInTheDocument()
    await nav(u, 'Backlog')
    await addFeature(u, 'New one')
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('Idea: 1')).toBeInTheDocument()
  })

  it('deleting a feature updates Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keeper')
    await addFeature(u, 'Goner')
    await u.click(screen.getByRole('button', { name: /delete Goner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 1')).toBeInTheDocument()
  })

  it('theme toggle shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('P2 filter works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Low A')
    await addFeature(u, 'Low B')
    await addFeature(u, 'High C')
    const rA = featureRow('Low A')
    await u.selectOptions(within(rA).getByLabelText(/Priority for Low A/i), 'P2')
    const rB = featureRow('Low B')
    await u.selectOptions(within(rB).getByLabelText(/Priority for Low B/i), 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByText('Showing: 2 of 3')).toBeInTheDocument()
    expect(screen.queryByText('High C')).not.toBeInTheDocument()
  })
})
