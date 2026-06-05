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
  const li = screen.getByText(title).closest('li') as HTMLElement
  await u.click(within(li).getByRole('button', { name: /^update$/i }))
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Objectives view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Objectives')
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('adds a new objective with 0% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch product')
    expect(screen.getByText('Launch product')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.queryAllByText(/Progress:/)).toHaveLength(0)
  })

  it('updates progress on an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    await setProgress(u, 'Grow revenue', 80)
    expect(screen.getByText('Progress: 80%')).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Hire engineer')
    await u.click(screen.getByRole('button', { name: /delete hire engineer/i }))
    expect(screen.queryByText('Hire engineer')).not.toBeInTheDocument()
  })

  it('shows zero stats when no objectives exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 0')).toBeInTheDocument()
  })

  it('stats reflect added objectives (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Obj A')
    await setProgress(u, 'Obj A', 100)
    await addObjective(u, 'Obj B')
    await setProgress(u, 'Obj B', 50)
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 75%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 1')).toBeInTheDocument()
  })

  it('on-track count includes objectives at exactly 70%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Edge case')
    await setProgress(u, 'Edge case', 70)
    await nav(u, 'Stats')
    expect(screen.getByText('On-track (>=70%): 1')).toBeInTheDocument()
  })

  it('objective just below 70% does not count as on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Almost')
    await setProgress(u, 'Almost', 69)
    await nav(u, 'Stats')
    expect(screen.getByText('On-track (>=70%): 0')).toBeInTheDocument()
  })

  it('average rounds to nearest whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await setProgress(u, 'X', 33)
    await addObjective(u, 'Y')
    await setProgress(u, 'Y', 34)
    await addObjective(u, 'Z')
    await setProgress(u, 'Z', 0)
    // avg = (33+34+0)/3 = 22.33 -> rounds to 22
    await nav(u, 'Stats')
    expect(screen.getByText('Average progress: 22%')).toBeInTheDocument()
  })

  it('deleting an objective updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep')
    await setProgress(u, 'Keep', 90)
    await addObjective(u, 'Remove')
    await setProgress(u, 'Remove', 10)
    await u.click(screen.getByRole('button', { name: /delete remove/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 90%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 1')).toBeInTheDocument()
  })

  it('objectives state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persistent goal')
    await nav(u, 'Settings')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persistent goal')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme attribute across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Objectives')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('reset all objectives clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Objectives')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('reset all objectives reflects in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Temp')
    await setProgress(u, 'Temp', 100)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
  })

  it('can add objectives after a reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'First')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Objectives')
    await addObjective(u, 'After reset')
    expect(screen.getByText('After reset')).toBeInTheDocument()
  })

  it('multiple objectives all on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P1')
    await setProgress(u, 'P1', 70)
    await addObjective(u, 'P2')
    await setProgress(u, 'P2', 85)
    await addObjective(u, 'P3')
    await setProgress(u, 'P3', 100)
    await nav(u, 'Stats')
    expect(screen.getByText('On-track (>=70%): 3')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 85%')).toBeInTheDocument()
  })
})
