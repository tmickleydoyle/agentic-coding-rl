import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addObjective(u: U, title: string) {
  await u.clear(screen.getByLabelText(/objective title/i))
  await u.type(screen.getByLabelText(/objective title/i), title)
  await u.click(screen.getByRole('button', { name: /add objective/i }))
}

async function setProgress(u: U, title: string, value: number) {
  const input = screen.getByLabelText(`Set progress for ${title}`)
  await u.clear(input)
  await u.type(input, String(value))
  await u.click(screen.getByRole('button', { name: `Update ${title}` }))
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('adds an objective and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('updates the heading count after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Hire engineers')
    expect(screen.getByRole('heading', { name: /objectives \(1\)/i })).toBeInTheDocument()
    await addObjective(u, 'Launch product')
    expect(screen.getByRole('heading', { name: /objectives \(2\)/i })).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('updates progress for an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Reduce churn')
    await setProgress(u, 'Reduce churn', 80)
    expect(screen.getByText('Progress: 80%')).toBeInTheDocument()
  })

  it('dashboard shows zero stats with no objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('dashboard reflects added objectives (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Expand to EU')
    await addObjective(u, 'Cut costs')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard computes average progress correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'A')
    await addObjective(u, 'B')
    await setProgress(u, 'A', 60)
    await setProgress(u, 'B', 80)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 70%')).toBeInTheDocument()
  })

  it('dashboard shows on track count (>=70)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await addObjective(u, 'Gamma')
    await setProgress(u, 'Alpha', 70)
    await setProgress(u, 'Beta', 90)
    await setProgress(u, 'Gamma', 50)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('dashboard shows completed count (=100)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Done one')
    await addObjective(u, 'Done two')
    await addObjective(u, 'In progress')
    await setProgress(u, 'Done one', 100)
    await setProgress(u, 'Done two', 100)
    await setProgress(u, 'In progress', 80)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
  })

  it('an objective at exactly 69% is NOT on track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Nearly there')
    await setProgress(u, 'Nearly there', 69)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('an objective at exactly 70% IS on track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Just made it')
    await setProgress(u, 'Just made it', 70)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles to dark theme in Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Objectives')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('objectives state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Retained')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Retained')).toBeInTheDocument()
  })

  it('average progress rounds correctly for non-integer means', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await addObjective(u, 'Y')
    await addObjective(u, 'Z')
    await setProgress(u, 'X', 100)
    await setProgress(u, 'Y', 0)
    await setProgress(u, 'Z', 0)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 33%')).toBeInTheDocument()
  })

  it('a newly added objective always starts at 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Brand new')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('updating progress cross-view reflects in Dashboard on track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Milestone')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await setProgress(u, 'Milestone', 75)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })
})
