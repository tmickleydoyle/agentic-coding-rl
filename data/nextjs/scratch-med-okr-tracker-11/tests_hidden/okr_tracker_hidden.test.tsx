// HELD-OUT generalization tests — fresh scenarios and edge cases not covered by the main suite.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('OKR Tracker (held-out)', () => {
  it('heading count increases with each add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'First')
    await addObjective(u, 'Second')
    await addObjective(u, 'Third')
    expect(screen.getByRole('heading', { name: /objectives \(3\)/i })).toBeInTheDocument()
  })

  it('setting progress to 100 makes completed count go to 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Full done')
    await setProgress(u, 'Full done', 100)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('setting progress to 99 does NOT count as completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Almost done')
    await setProgress(u, 'Almost done', 99)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('total objectives matches dashboard after several adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const t of ['P', 'Q', 'R', 'S']) {
      await addObjective(u, t)
    }
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 4')).toBeInTheDocument()
  })

  it('average of a single objective equals that objective progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Solo')
    await setProgress(u, 'Solo', 55)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 55%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('progress display updates after clicking Update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Growing')
    await setProgress(u, 'Growing', 45)
    expect(screen.getByText('Progress: 45%')).toBeInTheDocument()
    await setProgress(u, 'Growing', 88)
    expect(screen.getByText('Progress: 88%')).toBeInTheDocument()
  })

  it('whitespace-only title is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), '   ')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })

  it('dashboard on track count is 0 when all objectives are below 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Low1')
    await addObjective(u, 'Low2')
    await setProgress(u, 'Low1', 30)
    await setProgress(u, 'Low2', 60)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('all objectives at 100 means average is 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Ace1')
    await addObjective(u, 'Ace2')
    await setProgress(u, 'Ace1', 100)
    await setProgress(u, 'Ace2', 100)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
  })
})
