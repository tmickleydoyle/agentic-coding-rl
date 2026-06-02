// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('OKR Tracker (held-out)', () => {
  it('adds three objectives and dashboard shows correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Retention')
    await addObjective(u, 'Acquisition')
    await addObjective(u, 'Engagement')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 3')).toBeInTheDocument()
  })

  it('all objectives on track when all set to 70 or above', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Q1 revenue')
    await addObjective(u, 'Q1 leads')
    await setProgress(u, 'Q1 revenue', '75')
    await setProgress(u, 'Q1 leads', '70')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
  })

  it('none on track when all below 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Low A')
    await addObjective(u, 'Low B')
    await setProgress(u, 'Low A', '50')
    await setProgress(u, 'Low B', '69')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('progress update is reflected on objectives view immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Fast update')
    await setProgress(u, 'Fast update', '45')
    expect(screen.getByText('Progress: 45%')).toBeInTheDocument()
  })

  it('removing all objectives resets dashboard to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Temp1')
    await addObjective(u, 'Temp2')
    const items = screen.getAllByRole('button', { name: /remove/i })
    for (const btn of items) {
      await u.click(btn)
    }
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('average is computed over remaining objectives after removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep')
    await addObjective(u, 'Delete')
    await setProgress(u, 'Keep', '80')
    await setProgress(u, 'Delete', '20')
    const deleteLi = screen.getByText('Delete').closest('li') as HTMLElement
    await u.click(within(deleteLi).getByRole('button', { name: /remove/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 80%')).toBeInTheDocument()
  })

  it('can update progress on the same objective multiple times', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Iterative')
    await setProgress(u, 'Iterative', '30')
    expect(screen.getByText('Progress: 30%')).toBeInTheDocument()
    await setProgress(u, 'Iterative', '60')
    expect(screen.getByText('Progress: 60%')).toBeInTheDocument()
    await setProgress(u, 'Iterative', '100')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('completed count increases as objectives hit 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Task A')
    await addObjective(u, 'Task B')
    await setProgress(u, 'Task A', '100')
    await setProgress(u, 'Task B', '100')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
  })

  it('theme toggle can be reversed back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('dashboard average with two objectives at 50 each equals 50%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Half A')
    await addObjective(u, 'Half B')
    await setProgress(u, 'Half A', '50')
    await setProgress(u, 'Half B', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 50%')).toBeInTheDocument()
  })
})
