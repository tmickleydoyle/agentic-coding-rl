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

  it('shows seeded objectives on load', () => {
    render(<App />)
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Improve retention')).toBeInTheDocument()
    expect(screen.getByText('Launch new feature')).toBeInTheDocument()
  })

  it('shows initial progress for seeded objectives', () => {
    render(<App />)
    expect(within(objRow('Grow revenue')).getByText('Progress: 80%')).toBeInTheDocument()
    expect(within(objRow('Improve retention')).getByText('Progress: 60%')).toBeInTheDocument()
    expect(within(objRow('Launch new feature')).getByText('Progress: 40%')).toBeInTheDocument()
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
    await u.type(screen.getByLabelText('Objective title'), 'Expand market')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    expect(screen.getByText('Expand market')).toBeInTheDocument()
    expect(within(objRow('Expand market')).getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    // still just 3 seeded items
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('updates progress of an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = within(objRow('Improve retention')).getByLabelText('Progress for Improve retention')
    await u.clear(input)
    await u.type(input, '75')
    await u.click(within(objRow('Improve retention')).getByRole('button', { name: 'Update' }))
    expect(within(objRow('Improve retention')).getByText('Progress: 75%')).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Launch new feature')).getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('Launch new feature')).not.toBeInTheDocument()
  })

  it('dashboard shows correct total for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 3')).toBeInTheDocument()
  })

  it('dashboard shows average progress for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // (80 + 60 + 40) / 3 = 60
    expect(screen.getByText('Average progress: 60%')).toBeInTheDocument()
  })

  it('dashboard shows on track count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // only Grow revenue (80) is >= 70
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('dashboard shows off track count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    // Improve retention (60) and Launch new feature (40) are < 70
    expect(screen.getByText('Off track: 2')).toBeInTheDocument()
  })

  it('dashboard updates after updating progress (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = within(objRow('Improve retention')).getByLabelText('Progress for Improve retention')
    await u.clear(input)
    await u.type(input, '90')
    await u.click(within(objRow('Improve retention')).getByRole('button', { name: 'Update' }))
    await nav(u, 'Dashboard')
    // (80 + 90 + 40) / 3 = 70
    expect(screen.getByText('Average progress: 70%')).toBeInTheDocument()
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Off track: 1')).toBeInTheDocument()
  })

  it('dashboard shows 0% average when all objectives are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Delete' }))
    await u.click(within(objRow('Improve retention')).getByRole('button', { name: 'Delete' }))
    await u.click(within(objRow('Launch new feature')).getByRole('button', { name: 'Delete' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Off track: 0')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Objectives')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('objective list state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Persistent goal')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persistent goal')).toBeInTheDocument()
  })

  it('dashboard reflects a newly added objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'New goal')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 4')).toBeInTheDocument()
    // (80 + 60 + 40 + 0) / 4 = 45
    expect(screen.getByText('Average progress: 45%')).toBeInTheDocument()
  })

  it('70% progress is considered on track', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = within(objRow('Launch new feature')).getByLabelText('Progress for Launch new feature')
    await u.clear(input)
    await u.type(input, '70')
    await u.click(within(objRow('Launch new feature')).getByRole('button', { name: 'Update' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })
})
