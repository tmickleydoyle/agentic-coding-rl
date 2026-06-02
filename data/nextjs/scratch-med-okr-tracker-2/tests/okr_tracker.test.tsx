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

async function setProgress(u: U, title: string, value: string) {
  const input = screen.getByLabelText(`Set progress for ${title}`)
  await u.clear(input)
  await u.type(input, value)
  const li = input.closest('li') as HTMLElement
  await u.click(within(li).getByRole('button', { name: /^update$/i }))
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
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

  it('adds an objective with 0% progress and Off Track label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText(/Progress: 0%/)).toBeInTheDocument()
    expect(screen.getByText(/Off Track/)).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.queryAllByText(/Progress:/)).toHaveLength(0)
  })

  it('updates progress and shows correct percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch beta')
    await setProgress(u, 'Launch beta', '80')
    expect(screen.getByText(/Progress: 80%/)).toBeInTheDocument()
  })

  it('shows On Track when progress >= 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Hire engineers')
    await setProgress(u, 'Hire engineers', '70')
    expect(screen.getByText(/On Track/)).toBeInTheDocument()
  })

  it('shows Off Track when progress < 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Cut costs')
    await setProgress(u, 'Cut costs', '69')
    expect(screen.getByText(/Off Track/)).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Expand market')
    await u.click(screen.getByRole('button', { name: /delete expand market/i }))
    expect(screen.queryByText('Expand market')).not.toBeInTheDocument()
  })

  it('dashboard shows zero stats when no objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Off track: 0')).toBeInTheDocument()
  })

  it('dashboard reflects added objectives (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Obj A')
    await addObjective(u, 'Obj B')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard average progress is computed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await setProgress(u, 'Alpha', '100')
    await setProgress(u, 'Beta', '0')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 50%')).toBeInTheDocument()
  })

  it('dashboard on track count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await addObjective(u, 'Y')
    await addObjective(u, 'Z')
    await setProgress(u, 'X', '75')
    await setProgress(u, 'Y', '90')
    await setProgress(u, 'Z', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Off track: 1')).toBeInTheDocument()
  })

  it('clamps progress to 100 on update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Max test')
    await setProgress(u, 'Max test', '150')
    expect(screen.getByText(/Progress: 100%/)).toBeInTheDocument()
  })

  it('clamps progress to 0 on update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Min test')
    await setProgress(u, 'Min test', '-10')
    expect(screen.getByText(/Progress: 0%/)).toBeInTheDocument()
  })

  it('filter on track only hides off-track objectives in Objectives view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'High goal')
    await addObjective(u, 'Low goal')
    await setProgress(u, 'High goal', '80')
    await setProgress(u, 'Low goal', '30')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter: on track only/i))
    await nav(u, 'Objectives')
    expect(screen.getByText('High goal')).toBeInTheDocument()
    expect(screen.queryByText('Low goal')).not.toBeInTheDocument()
  })

  it('filter does not affect Dashboard stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Good obj')
    await addObjective(u, 'Bad obj')
    await setProgress(u, 'Good obj', '80')
    await setProgress(u, 'Bad obj', '20')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter: on track only/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
    expect(screen.getByText('Off track: 1')).toBeInTheDocument()
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

  it('preserves state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persistent obj')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persistent obj')).toBeInTheDocument()
  })

  it('dashboard average rounds correctly for three objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P')
    await addObjective(u, 'Q')
    await addObjective(u, 'R')
    await setProgress(u, 'P', '100')
    await setProgress(u, 'Q', '100')
    await setProgress(u, 'R', '1')
    await nav(u, 'Dashboard')
    // (100+100+1)/3 = 67
    expect(screen.getByText('Average progress: 67%')).toBeInTheDocument()
  })
})
