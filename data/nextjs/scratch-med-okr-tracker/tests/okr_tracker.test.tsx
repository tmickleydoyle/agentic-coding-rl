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
  const input = screen.getByLabelText(`Progress for ${title}`)
  await u.clear(input)
  await u.type(input, String(value))
  const li = screen.getByText(title).closest('li') as HTMLElement
  await u.click(within(li).getByRole('button', { name: /^update$/i }))
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
    expect(screen.getByRole('heading', { name: /objectives \(/i })).toBeInTheDocument()
  })

  it('adds an objective and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Grow revenue')
    expect(screen.getByRole('heading', { name: /objectives \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Grow revenue')).toBeInTheDocument()
  })

  it('shows initial progress as 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Launch beta')
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('ignores blank objective title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('updates progress on an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Hire engineers')
    await setProgress(u, 'Hire engineers', 80)
    expect(screen.getByText('Progress: 80%')).toBeInTheDocument()
  })

  it('removes an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Reduce churn')
    await u.click(screen.getByRole('button', { name: /remove reduce churn/i }))
    expect(screen.queryByText('Reduce churn')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
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

  it('dashboard total reflects added objectives (cross-view state)', async () => {
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
    await setProgress(u, 'Alpha', 50)
    await setProgress(u, 'Beta', 90)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 70%')).toBeInTheDocument()
  })

  it('dashboard on-track count is objectives >= 70%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P1')
    await addObjective(u, 'P2')
    await addObjective(u, 'P3')
    await setProgress(u, 'P1', 69)
    await setProgress(u, 'P2', 70)
    await setProgress(u, 'P3', 100)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('dashboard completed count is objectives at exactly 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Full')
    await addObjective(u, 'Partial')
    await setProgress(u, 'Full', 100)
    await setProgress(u, 'Partial', 99)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('dashboard updates after removing an objective', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep')
    await addObjective(u, 'Drop')
    await setProgress(u, 'Keep', 80)
    await setProgress(u, 'Drop', 40)
    await u.click(screen.getByRole('button', { name: /remove drop/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 80%')).toBeInTheDocument()
  })

  it('objectives list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Sticky obj')
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Sticky obj')).toBeInTheDocument()
  })

  it('theme defaults to light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('multiple objectives count correctly in heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'One')
    await addObjective(u, 'Two')
    await addObjective(u, 'Three')
    expect(screen.getByRole('heading', { name: /objectives \(3\)/i })).toBeInTheDocument()
  })

  it('progress display updates after second update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Iterative')
    await setProgress(u, 'Iterative', 30)
    expect(screen.getByText('Progress: 30%')).toBeInTheDocument()
    await setProgress(u, 'Iterative', 75)
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument()
    expect(screen.queryByText('Progress: 30%')).not.toBeInTheDocument()
  })
})
