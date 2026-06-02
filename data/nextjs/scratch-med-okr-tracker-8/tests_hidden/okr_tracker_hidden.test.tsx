// HELD-OUT generalization tests — fresh scenarios and edge cases
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

describe('OKR Tracker (held-out)', () => {
  it('initially shows no progress entries', () => {
    render(<App />)
    expect(screen.queryAllByText(/Progress:/)).toHaveLength(0)
  })

  it('adding two objectives shows two progress lines', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Reduce churn')
    await addObjective(u, 'Expand market')
    expect(screen.getAllByText(/Progress: 0%/)).toHaveLength(2)
  })

  it('updating progress changes the displayed percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Q3 goal')
    await setProgress(u, 'Q3 goal', 55)
    expect(screen.getByText('Progress: 55%')).toBeInTheDocument()
    expect(screen.queryByText('Progress: 0%')).not.toBeInTheDocument()
  })

  it('updating progress twice reflects final value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Iteration')
    await setProgress(u, 'Iteration', 30)
    await setProgress(u, 'Iteration', 95)
    expect(screen.getByText('Progress: 95%')).toBeInTheDocument()
    expect(screen.queryByText('Progress: 30%')).not.toBeInTheDocument()
  })

  it('stats total increases as objectives are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await addObjective(u, 'First')
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await addObjective(u, 'Second')
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
  })

  it('average progress with a single objective equals that objective progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Solo')
    await setProgress(u, 'Solo', 60)
    await nav(u, 'Stats')
    expect(screen.getByText('Average progress: 60%')).toBeInTheDocument()
  })

  it('on-track count with progress at 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Complete')
    await setProgress(u, 'Complete', 100)
    await nav(u, 'Stats')
    expect(screen.getByText('On-track (>=70%): 1')).toBeInTheDocument()
  })

  it('deleting all objectives brings stats back to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Temp1')
    await addObjective(u, 'Temp2')
    await u.click(screen.getByRole('button', { name: /delete temp1/i }))
    await u.click(screen.getByRole('button', { name: /delete temp2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 0')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('reset clears objectives and stats go to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Doomed')
    await setProgress(u, 'Doomed', 80)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 0')).toBeInTheDocument()
  })

  it('three objectives two on-track average rounds correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'A1')
    await setProgress(u, 'A1', 100)
    await addObjective(u, 'A2')
    await setProgress(u, 'A2', 70)
    await addObjective(u, 'A3')
    await setProgress(u, 'A3', 20)
    // avg = (100+70+20)/3 = 63.33 -> rounds to 63
    await nav(u, 'Stats')
    expect(screen.getByText('Average progress: 63%')).toBeInTheDocument()
    expect(screen.getByText('On-track (>=70%): 2')).toBeInTheDocument()
  })
})
