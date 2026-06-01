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

describe('Habit tracker app', () => {
  it('starts on Today', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByText(/done today: 0/i)).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Weekly')
    expect(screen.getByRole('heading', { name: 'Weekly' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Today')
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument()
  })

  it('adds a habit and ignores duplicates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await addHabit(u, 'Run')
    await nav(u, 'Stats')
    expect(screen.getByText(/total habits: 1/i)).toBeInTheDocument()
  })

  it('marks a habit done today and counts it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await u.click(screen.getByLabelText(/run today/i))
    expect(screen.getByText(/done today: 1/i)).toBeInTheDocument()
  })

  it('reflects today completion in Stats (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await u.click(screen.getByLabelText(/run today/i))
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 1/i)).toBeInTheDocument()
    expect(within(habitStat('Run')).getByText(/completion: 14%/i)).toBeInTheDocument()
  })

  it('builds a multi-day streak from the Weekly grid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await u.click(screen.getByLabelText(/run today/i)) // Sun
    await nav(u, 'Weekly')
    await u.click(screen.getByLabelText(/^run sat$/i))
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 2/i)).toBeInTheDocument()
    expect(within(habitStat('Run')).getByText(/completion: 29%/i)).toBeInTheDocument()
  })

  it('separates current streak from a longer earlier run', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await nav(u, 'Weekly')
    for (const d of ['Mon', 'Tue', 'Wed']) {
      await u.click(screen.getByLabelText(new RegExp(`^run ${d}$`, 'i')))
    }
    await nav(u, 'Stats')
    expect(within(habitStat('Run')).getByText(/current streak: 0/i)).toBeInTheDocument()
    expect(within(habitStat('Run')).getByText(/longest streak: 3/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides habits done today when Hide completed today is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addHabit(u, 'Run')
    await addHabit(u, 'Read')
    await u.click(screen.getByLabelText(/run today/i))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide completed today/i))
    await nav(u, 'Today')
    expect(screen.queryByLabelText(/run today/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/read today/i)).toBeInTheDocument()
  })
})
