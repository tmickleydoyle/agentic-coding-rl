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
  await u.click(within(li).getByRole('button', { name: /update/i }))
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

  it('navigates back to Objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByRole('heading', { name: 'Objectives' })).toBeInTheDocument()
  })

  it('adds an objective with progress starting at 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores a blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.queryAllByText(/Progress:/)).toHaveLength(0)
  })

  it('updates progress on an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Hire team')
    await setProgress(u, 'Hire team', '50')
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('removes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch product')
    const li = screen.getByText('Launch product').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /remove/i }))
    expect(screen.queryByText('Launch product')).not.toBeInTheDocument()
  })

  it('shows empty dashboard stats when no objectives', async () => {
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
    await addObjective(u, 'Obj A')
    await addObjective(u, 'Obj B')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('dashboard average progress rounds correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X')
    await addObjective(u, 'Y')
    await addObjective(u, 'Z')
    await setProgress(u, 'X', '100')
    await nav(u, 'Dashboard')
    // 100+0+0 / 3 = 33.33 -> 33%
    expect(screen.getByText('Average progress: 33%')).toBeInTheDocument()
  })

  it('on track count includes objectives at exactly 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Alpha')
    await addObjective(u, 'Beta')
    await setProgress(u, 'Alpha', '70')
    await setProgress(u, 'Beta', '69')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('on track count includes objectives above 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P1')
    await addObjective(u, 'P2')
    await setProgress(u, 'P1', '80')
    await setProgress(u, 'P2', '90')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('completed count only includes objectives at 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Done one')
    await addObjective(u, 'Almost')
    await setProgress(u, 'Done one', '100')
    await setProgress(u, 'Almost', '99')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('ignores progress values above 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Bounded')
    await setProgress(u, 'Bounded', '150')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores progress values below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Negative')
    await setProgress(u, 'Negative', '-5')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('dashboard updates after removing an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'ToRemove')
    await addObjective(u, 'ToKeep')
    const li = screen.getByText('ToRemove').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /remove/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Objectives')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('objectives state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persistent goal')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Persistent goal')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('average progress with single objective at 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Solo')
    await setProgress(u, 'Solo', '100')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })
})
