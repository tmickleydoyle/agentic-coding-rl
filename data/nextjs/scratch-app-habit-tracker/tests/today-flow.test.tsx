import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today flow', () => {
  it('shows the date, done/total and completion percent from seed', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-28')
    expect(screen.getByTestId('today-done')).toHaveTextContent('2')
    expect(screen.getByTestId('today-total')).toHaveTextContent('3')
    expect(screen.getByTestId('today-percent')).toHaveTextContent('67')
  })

  it('marks seeded habits done or not for today', () => {
    render(<App />)
    expect(screen.getByTestId('habit-h1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('habit-h3')).toHaveAttribute('data-done', 'false')
  })

  it('toggling an undone habit marks it done and updates the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-h3'))
    expect(screen.getByTestId('habit-h3')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('today-done')).toHaveTextContent('3')
    expect(screen.getByTestId('today-percent')).toHaveTextContent('100')
  })

  it('toggling a done habit marks it undone', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-h1'))
    expect(screen.getByTestId('habit-h1')).toHaveAttribute('data-done', 'false')
    expect(screen.getByTestId('today-done')).toHaveTextContent('1')
  })

  it('toggle button label reflects done state', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('toggle-h1')).toHaveTextContent('Undo')
    expect(screen.getByTestId('toggle-h3')).toHaveTextContent('Done')
    await user.click(screen.getByTestId('toggle-h3'))
    expect(screen.getByTestId('toggle-h3')).toHaveTextContent('Undo')
  })

  it('toggling is reflected in the stats page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-h3'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-done-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-rate-value')).toHaveTextContent('100')
  })
})
