// HELD-OUT generalization tests — different inputs, sequences, and edge cases.
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

describe('OKR Tracker (held-out)', () => {
  it('newly added objective does not count as on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Objective title'), 'Brand new goal')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    // Seed had 2 on-track; new one at 0% should not change on-track count
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('setting progress to exactly 69 keeps objective off-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Grow revenue is at 80 (on-track). Set it to 69.
    const input = screen.getByLabelText('Set progress for Grow revenue')
    await u.clear(input)
    await u.type(input, '69')
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Update' }))
    // Was 2 on-track (Grow revenue 80, Launch feature 70). Now only Launch feature.
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('setting progress to exactly 70 counts as on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Reduce churn is at 60. Set to 70.
    const input = screen.getByLabelText('Set progress for Reduce churn')
    await u.clear(input)
    await u.type(input, '70')
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Update' }))
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
  })

  it('removing an on-track objective decrements on-track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Remove' }))
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('average rounds correctly for two objectives at 33 and 66', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove all seeded first
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Reduce churn')).getByRole('button', { name: 'Remove' }))
    await u.click(within(objRow('Launch feature')).getByRole('button', { name: 'Remove' }))
    await u.type(screen.getByLabelText('Objective title'), 'Alpha')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    await u.type(screen.getByLabelText('Objective title'), 'Beta')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    const inputA = screen.getByLabelText('Set progress for Alpha')
    await u.clear(inputA)
    await u.type(inputA, '33')
    await u.click(within(objRow('Alpha')).getByRole('button', { name: 'Update' }))
    const inputB = screen.getByLabelText('Set progress for Beta')
    await u.clear(inputB)
    await u.type(inputB, '66')
    await u.click(within(objRow('Beta')).getByRole('button', { name: 'Update' }))
    // (33+66)/2 = 49.5 -> rounds to 50
    expect(screen.getByText('Average: 50%')).toBeInTheDocument()
  })

  it('Dashboard Needs attention count matches low-progress objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Seeded: Grow revenue 80 (ok), Reduce churn 60 (needs attention), Launch feature 70 (ok)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
  })

  it('Dashboard updates after removing an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Launch feature')).getByRole('button', { name: 'Remove' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
    // Grow revenue 80 (on-track), Reduce churn 60 (needs attention)
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
  })

  it('objectives list clears title input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Objective title')
    await u.type(input, 'Clear me')
    await u.click(screen.getByRole('button', { name: 'Add objective' }))
    expect(input).toHaveValue('')
  })

  it('theme toggle can be reversed back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('progress display updates immediately after update button click', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Set progress for Launch feature')
    await u.clear(input)
    await u.type(input, '55')
    await u.click(within(objRow('Launch feature')).getByRole('button', { name: 'Update' }))
    expect(within(objRow('Launch feature')).getByText('Progress: 55%')).toBeInTheDocument()
  })
})
