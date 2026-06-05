import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function objRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('shows seeded objectives on load', () => {
    render(<App />)
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Reduce churn')).toBeInTheDocument()
    expect(screen.getByText('Launch feature')).toBeInTheDocument()
  })

  it('shows seeded progress values', () => {
    render(<App />)
    expect(within(objRow('Grow revenue')).getByText('Progress: 80%')).toBeInTheDocument()
    expect(within(objRow('Reduce churn')).getByText('Progress: 60%')).toBeInTheDocument()
    expect(within(objRow('Launch feature')).getByText('Progress: 70%')).toBeInTheDocument()
  })

  it('shows correct initial average for seeded data', () => {
    render(<App />)
    // (80+60+70)/3 = 70
    expect(screen.getByText('Average: 70%')).toBeInTheDocument()
  })

  it('shows correct initial on-track count for seeded data', () => {
    render(<App />)
    // Grow revenue (80) and Launch feature (70) are on-track
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new objective with 0% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Expand partnerships')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    expect(screen.getByText('Expand partnerships')).toBeInTheDocument()
    expect(within(objRow('Expand partnerships')).getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    const before = screen.getAllByRole('listitem').length
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    expect(screen.getAllByRole('listitem').length).toBe(before)
  })

  it('removes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Reduce churn')).not.toBeInTheDocument()
  })

  it('updates progress for an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Set progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '90')
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Update' }))
    expect(within(objRow('Reduce churn')).getByText('Progress: 90%')).toBeInTheDocument()
  })

  it('average updates after progress change', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Change Reduce churn to 100: (80+100+70)/3 = 83
    const input = screen.getByLabelText('Set progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '100')
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Update' }))
    expect(screen.getByText('Average: 83%')).toBeInTheDocument()
  })

  it('on-track count updates when progress crosses 70 threshold', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Reduce churn starts at 60 (not on-track). Set to 70 -> now on-track
    const input = screen.getByLabelText('Set progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '70')
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Update' }))
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
  })

  it('average is 0% when all objectives removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Launch feature')).getByRole('button', { name: 'Remove' }))
    expect(screen.getByText('Average: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('Dashboard shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 3')).toBeInTheDocument()
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 70%')).toBeInTheDocument()
  })

  it('Dashboard reflects an objective added in Objectives view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'New goal')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 4')).toBeInTheDocument()
  })

  it('Dashboard reflects progress update made in Objectives view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Set progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '90')
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Update' }))
    await nav(u, 'Dashboard')
    // All three now >= 70, so on-track = 3, needs attention = 0
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 0')).toBeInTheDocument()
  })

  it('Dashboard shows 0% average when all objectives removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Launch feature')).getByRole('button', { name: 'Remove' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
  })

  it('preserves state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Persist me')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('toggles the theme and persists data-theme across views', async () => {
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
})
