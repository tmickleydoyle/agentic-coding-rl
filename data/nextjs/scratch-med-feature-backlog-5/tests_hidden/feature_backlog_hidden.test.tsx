// HELD-OUT generalization tests — fresh scenarios, different inputs and sequences.
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
  it('heading count updates after each add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'First')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    await addFeature(u, 'Second')
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
    await addFeature(u, 'Third')
    expect(screen.getByRole('heading', { name: 'Features (3)' })).toBeInTheDocument()
  })

  it('deleting one of several features decrements count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep this')
    await addFeature(u, 'Remove this')
    await u.click(screen.getByRole('button', { name: /delete remove this/i }))
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Remove this')).not.toBeInTheDocument()
    expect(screen.getByText('Keep this')).toBeInTheDocument()
  })

  it('shipping all features gives 100% shipped rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Ship A')
    await addFeature(u, 'Ship B')
    await u.selectOptions(within(featureRow('Ship A')).getByLabelText(/status for ship a/i), 'shipped')
    await u.selectOptions(within(featureRow('Ship B')).getByLabelText(/status for ship b/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('one shipped out of three gives 33% shipped rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'X')
    await addFeature(u, 'Y')
    await addFeature(u, 'Z')
    await u.selectOptions(within(featureRow('Z')).getByLabelText(/status for z/i), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 33%')).toBeInTheDocument()
  })

  it('filter by P1 shows only P1 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High priority')
    await u.selectOptions(within(featureRow('High priority')).getByLabelText(/priority for high priority/i), 'P0')
    await addFeature(u, 'Medium priority')
    // Medium priority stays at default P1
    await addFeature(u, 'Low priority')
    await u.selectOptions(within(featureRow('Low priority')).getByLabelText(/priority for low priority/i), 'P2')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    expect(screen.getByText('Medium priority')).toBeInTheDocument()
    expect(screen.queryByText('High priority')).not.toBeInTheDocument()
    expect(screen.queryByText('Low priority')).not.toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Visible')
    await addFeature(u, 'Hidden by filter')
    await u.selectOptions(within(featureRow('Hidden by filter')).getByLabelText(/priority for hidden by filter/i), 'P0')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
  })

  it('changing status to shipped is reflected in Stats building count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'InFlight')
    await u.selectOptions(within(featureRow('InFlight')).getByLabelText(/status for inflight/i), 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Building: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
  })

  it('deleting the only feature resets Stats to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Lonely')
    await u.click(screen.getByRole('button', { name: /delete lonely/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('whitespace-only title is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/feature title/i), '   ')
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    expect(screen.getByRole('heading', { name: 'Features (0)' })).toBeInTheDocument()
  })

  it('theme toggle reflects current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('Stats shows correct P2 count after priority change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Nice feature')
    await u.selectOptions(within(featureRow('Nice feature')).getByLabelText(/priority for nice feature/i), 'P2')
    await nav(u, 'Stats')
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 0')).toBeInTheDocument()
  })
})
