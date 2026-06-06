import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Habit Streaks', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders page heading', () => {
    expect(screen.getByRole('heading', { name: /habit streaks/i })).toBeInTheDocument()
  })

  it('shows seed habits', () => {
    expect(screen.getAllByTestId('habit-item')).toHaveLength(3)
  })

  it('shows habit count', () => {
    expect(screen.getByTestId('habit-count').textContent).toBe('Habits: 3')
  })

  it('shows completed today count from seed', () => {
    expect(screen.getByTestId('completed-today').textContent).toBe('Completed today: 1')
  })

  it('shows streak counts', () => {
    const streaks = screen.getAllByTestId('streak-count')
    expect(streaks[0].textContent).toBe('5 days')
    expect(streaks[1].textContent).toBe('3 days')
    expect(streaks[2].textContent).toBe('12 days')
  })

  it('already-completed habit has Done button disabled', () => {
    const buttons = screen.getAllByRole('button', { name: /done/i })
    expect(buttons[0]).toBeDisabled()
  })

  it('completing a habit increments streak', async () => {
    const user = userEvent.setup()
    const completeButtons = screen.getAllByRole('button', { name: /complete/i })
    await user.click(completeButtons[0])
    const streaks = screen.getAllByTestId('streak-count')
    expect(streaks[0].textContent).toBe('6 days')
  })

  it('completing a habit disables button and shows Done', async () => {
    const user = userEvent.setup()
    const btn = screen.getAllByRole('button', { name: /complete/i })[0]
    await user.click(btn)
    expect(btn).toBeDisabled()
    expect(btn.textContent).toBe('Done')
  })

  it('completing a habit updates completed today count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /complete/i })[0])
    expect(screen.getByTestId('completed-today').textContent).toBe('Completed today: 2')
  })

  it('adds a new habit', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new habit name/i), 'Meditate')
    await user.click(screen.getByRole('button', { name: /add habit/i }))
    expect(screen.getAllByTestId('habit-item')).toHaveLength(4)
    expect(screen.getByText('Meditate')).toBeInTheDocument()
  })

  it('new habit starts with 0 days streak', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new habit name/i), 'Meditate')
    await user.click(screen.getByRole('button', { name: /add habit/i }))
    const streaks = screen.getAllByTestId('streak-count')
    expect(streaks[3].textContent).toBe('0 days')
  })

  it('clears input after adding habit', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/new habit name/i)
    await user.type(input, 'Meditate')
    await user.click(screen.getByRole('button', { name: /add habit/i }))
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('ignores blank habit name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add habit/i }))
    expect(screen.getAllByTestId('habit-item')).toHaveLength(3)
  })

  it('updates habit count after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new habit name/i), 'Yoga')
    await user.click(screen.getByRole('button', { name: /add habit/i }))
    expect(screen.getByTestId('habit-count').textContent).toBe('Habits: 4')
  })
})
