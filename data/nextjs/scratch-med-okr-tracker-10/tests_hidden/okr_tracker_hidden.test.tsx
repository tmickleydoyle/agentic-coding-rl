// HELD-OUT generalization tests — fresh scenarios and edge cases not seen during development.
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
  it('adding a new objective reflects in Dashboard total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Expand to EU')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await u.type(screen.getByLabelText('Objective title'), 'Win enterprise deals')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 5')).toBeInTheDocument()
  })

  it('a newly added objective starts needs-attention', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Brand refresh')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    // seeded: on-track=1, needs-attention=2; new obj at 0% => needs-attention=3
    expect(screen.getByText('Needs attention: 3')).toBeInTheDocument()
  })

  it('setting progress to exactly 70 counts as on track', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Launch mobile app')
    await u.clear(input)
    await u.type(input, '70')
    await u.click(screen.getByRole('button', { name: 'Update Launch mobile app' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('deleting an on-track objective reduces on-track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Grow revenue' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('average progress rounds correctly for uneven division', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Delete seeded data and add fresh objectives
    await u.click(screen.getByRole('button', { name: 'Delete Grow revenue' }))
    await u.click(screen.getByRole('button', { name: 'Delete Reduce churn' }))
    await u.click(screen.getByRole('button', { name: 'Delete Launch mobile app' }))
    await u.type(screen.getByLabelText('Objective title'), 'Alpha')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await u.type(screen.getByLabelText('Objective title'), 'Beta')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await u.type(screen.getByLabelText('Objective title'), 'Gamma')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    // Set Alpha to 100
    const inputA = screen.getByLabelText('Progress for Alpha')
    await u.clear(inputA)
    await u.type(inputA, '100')
    await u.click(screen.getByRole('button', { name: 'Update Alpha' }))
    // Beta stays 0, Gamma stays 0 => avg = round(100/3) = 33
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 33%')).toBeInTheDocument()
  })

  it('progress display updates immediately after update button click', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Progress for Grow revenue')
    await u.clear(input)
    await u.type(input, '55')
    await u.click(screen.getByRole('button', { name: 'Update Grow revenue' }))
    expect(within(objRow('Grow revenue')).getByText('Progress: 55%')).toBeInTheDocument()
  })

  it('objectives list is empty after clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all objectives/i }))
    await nav(u, 'Objectives')
    expect(screen.queryByText('Grow revenue')).not.toBeInTheDocument()
    expect(screen.queryByText('Reduce churn')).not.toBeInTheDocument()
    expect(screen.queryByText('Launch mobile app')).not.toBeInTheDocument()
  })

  it('can add objectives after clearing all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all objectives/i }))
    await nav(u, 'Objectives')
    await u.type(screen.getByLabelText('Objective title'), 'Fresh start')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByText('Fresh start')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('deleting an objective updates dashboard needs-attention', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Reduce churn' }))
    await u.click(screen.getByRole('button', { name: 'Delete Launch mobile app' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Needs attention: 0')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })
})
