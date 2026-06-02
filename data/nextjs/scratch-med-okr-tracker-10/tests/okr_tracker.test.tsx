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

  it('shows seeded objectives on first load', () => {
    render(<App />)
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Reduce churn')).toBeInTheDocument()
    expect(screen.getByText('Launch mobile app')).toBeInTheDocument()
  })

  it('shows seeded progress values', () => {
    render(<App />)
    expect(within(objRow('Grow revenue')).getByText('Progress: 80%')).toBeInTheDocument()
    expect(within(objRow('Reduce churn')).getByText('Progress: 60%')).toBeInTheDocument()
    expect(within(objRow('Launch mobile app')).getByText('Progress: 40%')).toBeInTheDocument()
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
    await u.type(screen.getByLabelText('Objective title'), 'Hire engineer')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByText('Hire engineer')).toBeInTheDocument()
    expect(within(objRow('Hire engineer')).getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    const countBefore = screen.getAllByRole('listitem').length
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getAllByRole('listitem').length).toBe(countBefore)
  })

  it('updates progress for an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '75')
    await u.click(screen.getByRole('button', { name: 'Update Reduce churn' }))
    expect(within(objRow('Reduce churn')).getByText('Progress: 75%')).toBeInTheDocument()
  })

  it('clamps progress above 100 to 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Grow revenue')
    await u.clear(input)
    await u.type(input, '150')
    await u.click(screen.getByRole('button', { name: 'Update Grow revenue' }))
    expect(within(objRow('Grow revenue')).getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('clamps progress below 0 to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Launch mobile app')
    await u.clear(input)
    await u.type(input, '-10')
    await u.click(screen.getByRole('button', { name: 'Update Launch mobile app' }))
    expect(within(objRow('Launch mobile app')).getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Reduce churn' }))
    expect(screen.queryByText('Reduce churn')).not.toBeInTheDocument()
  })

  it('dashboard shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 3')).toBeInTheDocument()
  })

  it('dashboard computes average progress from seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // (80 + 60 + 40) / 3 = 60
    expect(screen.getByText('Average progress: 60%')).toBeInTheDocument()
  })

  it('dashboard shows on-track count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // only Grow revenue (80) >= 70
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('dashboard shows needs-attention count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // Reduce churn (60) and Launch mobile app (40)
    expect(screen.getByText('Needs attention: 2')).toBeInTheDocument()
  })

  it('dashboard reflects updated progress cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '70')
    await u.click(screen.getByRole('button', { name: 'Update Reduce churn' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
  })

  it('dashboard shows 0% average when all objectives are cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all objectives/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 0')).toBeInTheDocument()
  })

  it('clear all removes objectives from the Objectives view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all objectives/i }))
    await nav(u, 'Objectives')
    expect(screen.queryByText('Grow revenue')).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('preserves objectives state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Retain customers')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Retain customers')).toBeInTheDocument()
  })

  it('dashboard total increases after adding an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'New goal')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 4')).toBeInTheDocument()
  })
})
