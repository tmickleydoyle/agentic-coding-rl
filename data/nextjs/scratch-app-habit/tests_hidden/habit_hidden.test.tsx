// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const habitStat = (name: string) => screen.getByRole('region', { name })

async function addHabit(u: U, name: string) {
  await u.clear(screen.getByLabelText(/habit name/i))
  await u.type(screen.getByLabelText(/habit name/i), name)
  await u.click(screen.getByRole('button', { name: /add habit/i }))
}

describe('Habit tracker (held-out)', () => {
  it('reaches a full week: streak 7 and 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await nav(u, 'Weekly')
    for (const d of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      await u.click(screen.getByLabelText(new RegExp(`^run ${d}$`, 'i')))
    }
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 7/i)).toBeInTheDocument()
    expect(within(habitStat('Run')).getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('keeps two habits independent in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await addHabit(u, 'Read')
    await u.click(screen.getByLabelText(/run today/i))
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 1/i)).toBeInTheDocument()
    expect(within(habitStat('Read')).getByText(/current streak: 0/i)).toBeInTheDocument()
  })

  it('unchecking a day on Weekly drops the streak back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await u.click(screen.getByLabelText(/run today/i))
    expect(screen.getByText(/done today: 1/i)).toBeInTheDocument()
    await nav(u, 'Weekly')
    await u.click(screen.getByLabelText(/^run sun$/i)) // untoggle today
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 0/i)).toBeInTheDocument()
  })

  it('shows the new habit on the Weekly grid (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Meditate')
    await nav(u, 'Weekly')
    expect(screen.getByRole('region', { name: 'Meditate' })).toBeInTheDocument()
    expect(screen.getByLabelText(/^meditate mon$/i)).toBeInTheDocument()
  })
})
