// HELD-OUT generalization tests — fresh scenarios not in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function objRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('OKR Tracker (held-out)', () => {
  it('deleting one seeded objective updates dashboard total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Delete' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('deleting on-track objective decrements on track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Grow revenue (80) is the only on-track item
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Delete' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Off track: 2')).toBeInTheDocument()
  })

  it('average rounds correctly for uneven division', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Delete two, keep only Launch new feature (40), add one at 0 = (40+0)/2 = 20
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Delete' }))
    await u.click(within(objRow('Improve retention')).getByRole('button', { name: 'Delete' }))
    await u.type(screen.getByLabelText('Objective title'), 'Extra')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 20%')).toBeInTheDocument()
  })

  it('setting progress to 69 keeps objective off track', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = within(objRow('Grow revenue')).getByLabelText('Progress for Grow revenue')
    await u.clear(input)
    await u.type(input, '69')
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Update' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Off track: 3')).toBeInTheDocument()
  })

  it('new objective added then updated to 100 shows on track in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Crush it')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    const input = within(objRow('Crush it')).getByLabelText('Progress for Crush it')
    await u.clear(input)
    await u.type(input, '100')
    await u.click(within(objRow('Crush it')).getByRole('button', { name: 'Update' }))
    expect(within(objRow('Crush it')).getByText('Progress: 100%')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    // Grow revenue (80) + Crush it (100) = 2 on track
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
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

  it('progress display updates immediately after clicking Update', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = within(objRow('Launch new feature')).getByLabelText('Progress for Launch new feature')
    await u.clear(input)
    await u.type(input, '55')
    await u.click(within(objRow('Launch new feature')).getByRole('button', { name: 'Update' }))
    expect(within(objRow('Launch new feature')).getByText('Progress: 55%')).toBeInTheDocument()
  })

  it('objectives list state is preserved after visiting Settings and returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Sticky objective')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Settings')
    await nav(u, 'Objectives')
    expect(screen.getByText('Sticky objective')).toBeInTheDocument()
  })

  it('dashboard average with a single 100% objective shows 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Delete' }))
    await u.click(within(objRow('Improve retention')).getByRole('button', { name: 'Delete' }))
    await u.click(within(objRow('Launch new feature')).getByRole('button', { name: 'Delete' }))
    await u.type(screen.getByLabelText('Objective title'), 'Perfect')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    const input = within(objRow('Perfect')).getByLabelText('Progress for Perfect')
    await u.clear(input)
    await u.type(input, '100')
    await u.click(within(objRow('Perfect')).getByRole('button', { name: 'Update' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
    expect(screen.getByText('Off track: 0')).toBeInTheDocument()
  })
})
