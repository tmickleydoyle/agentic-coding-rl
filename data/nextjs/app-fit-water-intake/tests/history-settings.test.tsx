import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history, goal and settings', () => {
  it('shows per-day totals most-recent-first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const rows = screen.getByTestId('day-list').querySelectorAll('li')
    expect(rows[0].getAttribute('data-testid')).toBe('day-2026-05-28')
    expect(rows[1].getAttribute('data-testid')).toBe('day-2026-05-27')
    expect(screen.getByTestId('day-2026-05-27-total')).toHaveTextContent('1250')
    expect(screen.getByTestId('day-2026-05-28-total')).toHaveTextContent('250')
  })

  it('flags a day as met when its total reaches the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '1000')
    await user.click(screen.getByTestId('submit-goal'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('day-2026-05-27')).toHaveAttribute('data-met', 'true') // 1250
    expect(screen.getByTestId('day-2026-05-28')).toHaveAttribute('data-met', 'false') // 250
  })

  it('shows goal stats and updates the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('2000')
    expect(screen.getByTestId('stat-today-value')).toHaveTextContent('250')
    expect(screen.getByTestId('stat-remaining-value')).toHaveTextContent('1750')
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '2500')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('2500')
  })

  it('recomputes remaining after changing the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '1000')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('stat-remaining-value')).toHaveTextContent('750')
  })

  it('rejects a non-positive goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '0')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('current-goal')).toHaveTextContent('2000')
  })

  it('shows and adjusts the reminders count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('reminders-count')).toHaveTextContent('4')
    await user.click(screen.getByTestId('reminders-inc'))
    expect(screen.getByTestId('reminders-count')).toHaveTextContent('5')
    await user.click(screen.getByTestId('reminders-dec'))
    await user.click(screen.getByTestId('reminders-dec'))
    expect(screen.getByTestId('reminders-count')).toHaveTextContent('3')
  })

  it('does not let the reminders count go below zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByTestId('reminders-dec'))
    }
    expect(screen.getByTestId('reminders-count')).toHaveTextContent('0')
  })

  it('toggles the theme and reflects it on the root', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme when navigating away and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('theme-toggle'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
