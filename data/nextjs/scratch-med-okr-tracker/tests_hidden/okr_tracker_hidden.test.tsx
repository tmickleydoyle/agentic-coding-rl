// HELD-OUT generalization tests — different inputs, edge cases, cross-view sequences.
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

describe('OKR Tracker (held-out)', () => {
  it('average rounds correctly for three uneven values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X1')
    await addObjective(u, 'X2')
    await addObjective(u, 'X3')
    await setProgress(u, 'X1', 10)
    await setProgress(u, 'X2', 20)
    await setProgress(u, 'X3', 30)
    await nav(u, 'Dashboard')
    // (10+20+30)/3 = 20
    expect(screen.getByText('Average progress: 20%')).toBeInTheDocument()
  })

  it('on-track count updates after progress is updated (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Ramp')
    await setProgress(u, 'Ramp', 65)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await setProgress(u, 'Ramp', 72)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('completed count is 0 when all objectives are below 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Almost')
    await setProgress(u, 'Almost', 99)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('removing all objectives resets dashboard to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Temp')
    await setProgress(u, 'Temp', 90)
    await u.click(screen.getByRole('button', { name: /remove temp/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('adding two objectives with 100% shows completed: 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Done1')
    await addObjective(u, 'Done2')
    await setProgress(u, 'Done1', 100)
    await setProgress(u, 'Done2', 100)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByText('On track: 2')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
  })

  it('objective count heading decrements on remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'ObjA')
    await addObjective(u, 'ObjB')
    expect(screen.getByRole('heading', { name: /objectives \(2\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /remove objb/i }))
    expect(screen.getByRole('heading', { name: /objectives \(1\)/i })).toBeInTheDocument()
  })

  it('theme toggle can toggle back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('progress display on objective uses the updated value after navigation away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Persist progress')
    await setProgress(u, 'Persist progress', 55)
    await nav(u, 'Dashboard')
    await nav(u, 'Objectives')
    expect(screen.getByText('Progress: 55%')).toBeInTheDocument()
  })

  it('70% progress counts as on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Boundary')
    await setProgress(u, 'Boundary', 70)
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })
})
