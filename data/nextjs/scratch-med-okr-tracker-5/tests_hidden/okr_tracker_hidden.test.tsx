// HELD-OUT generalization tests — different inputs, edge cases, and sequences.
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

describe('OKR Tracker (held-out)', () => {
  it('heading shows correct count after multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Obj one')
    await addObjective(u, 'Obj two')
    await addObjective(u, 'Obj three')
    expect(screen.getByRole('heading', { name: 'Objectives (3)' })).toBeInTheDocument()
  })

  it('deleting one of several updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep')
    await addObjective(u, 'Remove')
    const li = screen.getByText('Remove').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /delete/i }))
    expect(screen.getByRole('heading', { name: 'Objectives (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('updating progress to exactly 70 makes it on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Borderline')
    await setProgress(u, 'Borderline', '70')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('progress just below 70 is not on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Almost')
    await setProgress(u, 'Almost', '69')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('a single objective at 100% is both on-track and completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Full')
    await setProgress(u, 'Full', '100')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
  })

  it('completed count does not include < 100 objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Nearly')
    await setProgress(u, 'Nearly', '99')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('progress display updates after second update call', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Iterative')
    await setProgress(u, 'Iterative', '30')
    expect(screen.getByText('Progress: 30%')).toBeInTheDocument()
    await setProgress(u, 'Iterative', '85')
    expect(screen.getByText('Progress: 85%')).toBeInTheDocument()
    expect(screen.queryByText('Progress: 30%')).not.toBeInTheDocument()
  })

  it('reset from settings leaves dashboard with all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'X1')
    await setProgress(u, 'X1', '90')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all objectives/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('average rounds 66.6 to 67', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'P')
    await addObjective(u, 'Q')
    await addObjective(u, 'R')
    await setProgress(u, 'P', '100')
    await setProgress(u, 'Q', '100')
    await setProgress(u, 'R', '0')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 67%')).toBeInTheDocument()
  })

  it('theme toggle changes to dark and toggling again returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('dashboard total matches count of objectives after adds and a delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Stay')
    await addObjective(u, 'Go')
    const li = screen.getByText('Go').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
  })
})
