import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history page', () => {
  it('groups meals by date newest first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const list = screen.getByTestId('day-list')
    expect(within(list).getByTestId('day-2026-05-29')).toBeInTheDocument()
    expect(within(list).getByTestId('day-2026-05-28')).toBeInTheDocument()
  })

  it('shows per-day calorie totals and counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('day-2026-05-29-calories')).toHaveTextContent('770')
    expect(screen.getByTestId('day-2026-05-29-count')).toHaveTextContent('2')
    expect(screen.getByTestId('day-2026-05-28-calories')).toHaveTextContent('95')
    expect(screen.getByTestId('day-2026-05-28-count')).toHaveTextContent('1')
  })
})

describe('goals page', () => {
  it('shows the current calorie goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('current-goal-calories')).toHaveTextContent('2000')
  })

  it('updates the goal and reflects it on today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goals'))
    await user.clear(screen.getByTestId('goal-calories-input'))
    await user.type(screen.getByTestId('goal-calories-input'), '1500')
    await user.click(screen.getByTestId('save-goal'))
    expect(screen.getByTestId('saved-msg')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('calorie-goal-value')).toHaveTextContent('1500')
    // 1500 - 770 = 730
    expect(screen.getByTestId('calorie-remaining-value')).toHaveTextContent('730')
  })
})

describe('theme', () => {
  it('defaults to light and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-goals'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
