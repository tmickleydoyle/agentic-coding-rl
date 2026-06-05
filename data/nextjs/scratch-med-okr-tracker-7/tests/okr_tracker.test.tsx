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
  const li = input.closest('li')!
  await u.click(within(li as HTMLElement).getByRole('button', { name: /update/i }))
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Objectives from Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByRole('heading', { name: /objectives/i })).toBeInTheDocument()
  })

  it('adds an objective and shows it with 0% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch MVP')
    expect(screen.getByText('Launch MVP')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /objectives \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('updates progress on an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow team')
    await setProgress(u, 'Grow team', '80')
    expect(screen.getByText('Progress: 80%')).toBeInTheDocument()
  })

  it('clamps progress above 100 to 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Exceed targets')
    await setProgress(u, 'Exceed targets', '150')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('clamps progress below 0 to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Stay stable')
    await setProgress(u, 'Stay stable', '-20')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('removes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'To be removed')
    expect(screen.getByRole('heading', { name: /objectives \(1\)/i })).toBeInTheDocument()
    const li = screen.getByText('To be removed').closest('li')!
    await u.click(within(li as HTMLElement).getByRole('button', { name: /remove/i }))
    expect(screen.queryByText('To be removed')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('dashboard shows zeros when no objectives', async () => {
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
    await addObjective(u, 'Q1 Goal')
    await addObjective(u, 'Q2 Goal')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard computes average progress correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await setProgress(u, 'Alpha', '60')
    await setProgress(u, 'Beta', '80')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 70%')).toBeInTheDocument()
  })

  it('dashboard counts on-track objectives (progress >= 70)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Goal A')
    await addObjective(u, 'Goal B')
    await addObjective(u, 'Goal C')
    await setProgress(u, 'Goal A', '70')
    await setProgress(u, 'Goal B', '90')
    await setProgress(u, 'Goal C', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('dashboard counts completed objectives (progress = 100)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Done Obj')
    await addObjective(u, 'Partial Obj')
    await setProgress(u, 'Done Obj', '100')
    await setProgress(u, 'Partial Obj', '60')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('dashboard average rounds to whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await addObjective(u, 'Y')
    await addObjective(u, 'Z')
    await setProgress(u, 'X', '100')
    await setProgress(u, 'Y', '0')
    await setProgress(u, 'Z', '0')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 33%')).toBeInTheDocument()
  })

  it('removes an objective and dashboard updates (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep')
    await addObjective(u, 'Drop')
    const li = screen.getByText('Drop').closest('li')!
    await u.click(within(li as HTMLElement).getByRole('button', { name: /remove/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
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

  it('toggles theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('keeps objective state after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persistent Goal')
    await setProgress(u, 'Persistent Goal', '55')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persistent Goal')).toBeInTheDocument()
    expect(screen.getByText('Progress: 55%')).toBeInTheDocument()
  })

  it('multiple objectives heading count is accurate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Obj 1')
    await addObjective(u, 'Obj 2')
    await addObjective(u, 'Obj 3')
    expect(screen.getByRole('heading', { name: /objectives \(3\)/i })).toBeInTheDocument()
  })
})
