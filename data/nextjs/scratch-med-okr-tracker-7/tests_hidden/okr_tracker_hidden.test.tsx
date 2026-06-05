// HELD-OUT generalization tests — fresh cross-view scenarios and edge cases.
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

describe('OKR Tracker (held-out)', () => {
  it('progress: 69 is not on-track, 70 is on-track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Borderline')
    await setProgress(u, 'Borderline', '69')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await setProgress(u, 'Borderline', '70')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('all objectives completed means Completed equals Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Full A')
    await addObjective(u, 'Full B')
    await setProgress(u, 'Full A', '100')
    await setProgress(u, 'Full B', '100')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 2')).toBeInTheDocument()
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
  })

  it('removing all objectives resets dashboard to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Temp')
    await setProgress(u, 'Temp', '80')
    const li = screen.getByText('Temp').closest('li')!
    await u.click(within(li as HTMLElement).getByRole('button', { name: /remove/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
  })

  it('updating progress reflects immediately in objectives list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Iterative')
    await setProgress(u, 'Iterative', '30')
    expect(screen.getByText('Progress: 30%')).toBeInTheDocument()
    await setProgress(u, 'Iterative', '65')
    expect(screen.getByText('Progress: 65%')).toBeInTheDocument()
    expect(screen.queryByText('Progress: 30%')).not.toBeInTheDocument()
  })

  it('average of single objective equals its progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Solo')
    await setProgress(u, 'Solo', '42')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 42%')).toBeInTheDocument()
  })

  it('heading count decrements after removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'One')
    await addObjective(u, 'Two')
    await addObjective(u, 'Three')
    const li = screen.getByText('Two').closest('li')!
    await u.click(within(li as HTMLElement).getByRole('button', { name: /remove/i }))
    expect(screen.getByRole('heading', { name: /objectives \(2\)/i })).toBeInTheDocument()
  })

  it('on-track count updates after progress drops below 70', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Slipping')
    await setProgress(u, 'Slipping', '75')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
    await nav(u, 'Objectives')
    await setProgress(u, 'Slipping', '60')
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })

  it('whitespace-only objective title is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), '   ')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    expect(screen.getByRole('heading', { name: /objectives \(0\)/i })).toBeInTheDocument()
  })
})
