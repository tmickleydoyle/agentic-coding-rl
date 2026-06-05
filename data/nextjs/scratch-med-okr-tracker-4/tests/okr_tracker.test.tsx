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

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('shows the three seeded objectives on load', () => {
    render(<App />)
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Improve NPS')).toBeInTheDocument()
    expect(screen.getByText('Launch mobile app')).toBeInTheDocument()
  })

  it('displays seeded progress values', () => {
    render(<App />)
    expect(screen.getByText('Progress: 80%')).toBeInTheDocument()
    expect(screen.getByText('Progress: 60%')).toBeInTheDocument()
    expect(screen.getByText('Progress: 40%')).toBeInTheDocument()
  })

  it('navigates to Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('adds a new objective with 0% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), 'Expand market')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByText('Expand market')).toBeInTheDocument()
    expect(within(objRow('Expand market')).getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('updates progress for an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/progress for improve nps/i)
    await u.clear(input)
    await u.type(input, '75')
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /update/i }))
    expect(within(objRow('Improve NPS')).getByText('Progress: 75%')).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Launch mobile app')).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Launch mobile app')).not.toBeInTheDocument()
  })

  it('dashboard shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 3')).toBeInTheDocument()
  })

  it('dashboard shows average progress for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // (80+60+40)/3 = 60
    expect(screen.getByText('Average progress: 60%')).toBeInTheDocument()
  })

  it('dashboard shows on-track count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // Only Grow revenue (80%) is >= 70
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('dashboard shows needs-attention count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // Improve NPS (60%) and Launch mobile app (40%) are < 70
    expect(screen.getByText('Needs attention: 2')).toBeInTheDocument()
  })

  it('dashboard reflects updated progress (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/progress for improve nps/i)
    await u.clear(input)
    await u.type(input, '70')
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /update/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
  })

  it('dashboard updates after an objective is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard shows 0% average when all objectives are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Launch mobile app')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
  })

  it('dashboard shows on track 0 and needs attention 0 when no objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Launch mobile app')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 0')).toBeInTheDocument()
  })

  it('toggles the theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Objectives')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), 'New goal')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('New goal')).toBeInTheDocument()
  })

  it('70% progress counts as on track', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/progress for launch mobile app/i)
    await u.clear(input)
    await u.type(input, '70')
    await u.click(within(objRow('Launch mobile app')).getByRole('button', { name: /update/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })
})
