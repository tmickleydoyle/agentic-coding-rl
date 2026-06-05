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
  const input = screen.getByLabelText(new RegExp(`progress for ${title}`, 'i'))
  await u.clear(input)
  await u.type(input, value)
  const li = screen.getByText(title).closest('li') as HTMLElement
  await u.click(within(li).getByRole('button', { name: /update/i }))
}

describe('OKR Tracker app', () => {
  it('starts on the Objectives view with zero objectives', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Objectives (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Objectives (0)' })).toBeInTheDocument()
  })

  it('adds an objective and shows it with 0% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch product')
    expect(screen.getByText('Launch product')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Objectives (1)' })).toBeInTheDocument()
  })

  it('ignores blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: 'Objectives (0)' })).toBeInTheDocument()
  })

  it('updates progress on an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    await setProgress(u, 'Grow revenue', '75')
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument()
  })

  it('clamps progress above 100 to 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Clamp high')
    await setProgress(u, 'Clamp high', '150')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('clamps progress below 0 to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Clamp low')
    await setProgress(u, 'Clamp low', '-10')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('deletes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'To be deleted')
    expect(screen.getByRole('heading', { name: 'Objectives (1)' })).toBeInTheDocument()
    const li = screen.getByText('To be deleted').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('To be deleted')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Objectives (0)' })).toBeInTheDocument()
  })

  it('dashboard shows zeros when no objectives exist', async () => {
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
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard computes average progress correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await addObjective(u, 'Y')
    await setProgress(u, 'X', '80')
    await setProgress(u, 'Y', '40')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 60%')).toBeInTheDocument()
  })

  it('dashboard counts on-track objectives (progress >= 70)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P')
    await addObjective(u, 'Q')
    await addObjective(u, 'R')
    await setProgress(u, 'P', '70')
    await setProgress(u, 'Q', '90')
    await setProgress(u, 'R', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('dashboard counts completed objectives (progress === 100)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Done one')
    await addObjective(u, 'Done two')
    await addObjective(u, 'In progress')
    await setProgress(u, 'Done one', '100')
    await setProgress(u, 'Done two', '100')
    await setProgress(u, 'In progress', '80')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
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

  it('reset all objectives clears the list and updates dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Will be reset')
    await addObjective(u, 'Also reset')
    expect(screen.getByRole('heading', { name: 'Objectives (2)' })).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Objectives')
    expect(screen.getByRole('heading', { name: 'Objectives (0)' })).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
  })

  it('objectives state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persisted obj')
    await setProgress(u, 'Persisted obj', '55')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persisted obj')).toBeInTheDocument()
    expect(screen.getByText('Progress: 55%')).toBeInTheDocument()
  })

  it('average rounds correctly for three objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'A')
    await addObjective(u, 'B')
    await addObjective(u, 'C')
    await setProgress(u, 'A', '100')
    await setProgress(u, 'B', '0')
    await setProgress(u, 'C', '0')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 33%')).toBeInTheDocument()
  })
})
