import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

async function addHabit(u: U, name: string) {
  await u.clear(screen.getByLabelText(/habit name/i))
  await u.type(screen.getByLabelText(/habit name/i), name)
  await u.click(screen.getByRole('button', { name: /add habit/i }))
}
async function toggle(u: U, habit: string, day: string) {
  await u.click(screen.getByLabelText(`${habit} ${day}`))
}
function row(name: string): HTMLElement {
  return screen.getByRole('region', { name })
}

describe('Habit tracker', () => {
  it('adds a habit with zeroed stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    const r = row('Exercise')
    expect(within(r).getByText(/current streak: 0/i)).toBeInTheDocument()
    expect(within(r).getByText(/longest streak: 0/i)).toBeInTheDocument()
    expect(within(r).getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('ignores blank and duplicate habit names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, '   ')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    await addHabit(u, 'Read')
    await addHabit(u, 'Read')
    expect(screen.getAllByRole('region', { name: 'Read' })).toHaveLength(1)
  })

  it('computes longest streak without a current streak (Sun not done)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    await toggle(u, 'Exercise', 'Mon')
    await toggle(u, 'Exercise', 'Tue')
    await toggle(u, 'Exercise', 'Wed')
    const r = row('Exercise')
    expect(within(r).getByText(/current streak: 0/i)).toBeInTheDocument()
    expect(within(r).getByText(/longest streak: 3/i)).toBeInTheDocument()
    expect(within(r).getByText(/completion: 43%/i)).toBeInTheDocument()
  })

  it('counts a current streak from Sun backward', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    await toggle(u, 'Exercise', 'Fri')
    await toggle(u, 'Exercise', 'Sat')
    await toggle(u, 'Exercise', 'Sun')
    const r = row('Exercise')
    expect(within(r).getByText(/current streak: 3/i)).toBeInTheDocument()
    expect(within(r).getByText(/longest streak: 3/i)).toBeInTheDocument()
    expect(within(r).getByText(/completion: 43%/i)).toBeInTheDocument()
  })

  it('distinguishes current streak from a longer earlier run', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    // Mon-Thu done (run of 4), Fri off, Sat-Sun done (current run of 2)
    await toggle(u, 'Exercise', 'Mon')
    await toggle(u, 'Exercise', 'Tue')
    await toggle(u, 'Exercise', 'Wed')
    await toggle(u, 'Exercise', 'Thu')
    await toggle(u, 'Exercise', 'Sat')
    await toggle(u, 'Exercise', 'Sun')
    const r = row('Exercise')
    expect(within(r).getByText(/current streak: 2/i)).toBeInTheDocument()
    expect(within(r).getByText(/longest streak: 4/i)).toBeInTheDocument()
    expect(within(r).getByText(/completion: 86%/i)).toBeInTheDocument()
  })

  it('reaches a full week: 7 streak and 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    for (const d of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      await toggle(u, 'Exercise', d)
    }
    const r = row('Exercise')
    expect(within(r).getByText(/current streak: 7/i)).toBeInTheDocument()
    expect(within(r).getByText(/longest streak: 7/i)).toBeInTheDocument()
    expect(within(r).getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('untoggles a day back off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    await toggle(u, 'Exercise', 'Sun')
    expect(within(row('Exercise')).getByText(/current streak: 1/i)).toBeInTheDocument()
    await toggle(u, 'Exercise', 'Sun')
    expect(within(row('Exercise')).getByText(/current streak: 0/i)).toBeInTheDocument()
  })

  it('keeps habits independent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Read')
    await addHabit(u, 'Run')
    await toggle(u, 'Read', 'Sun')
    expect(within(row('Read')).getByText(/current streak: 1/i)).toBeInTheDocument()
    expect(within(row('Run')).getByText(/current streak: 0/i)).toBeInTheDocument()
  })

  it('removes a habit', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Exercise')
    await u.click(screen.getByRole('button', { name: /remove exercise/i }))
    expect(screen.queryByRole('region', { name: 'Exercise' })).not.toBeInTheDocument()
  })
})
