import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today flow', () => {
  it('shows the date and seed completion counts', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-28')
    // r1 incomplete (not in today history); r2 complete but history has no today => 0
    expect(screen.getByTestId('today-completed')).toHaveTextContent('0')
  })

  it('renders each routine with its steps and completion flags', () => {
    render(<App />)
    expect(screen.getByTestId('routine-r1-name')).toHaveTextContent('Morning')
    expect(screen.getByTestId('routine-r1')).toHaveAttribute('data-complete', 'false')
    expect(screen.getByTestId('routine-r2')).toHaveAttribute('data-complete', 'true')
    expect(screen.getByTestId('step-r1-s1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('step-r1-s3')).toHaveAttribute('data-done', 'false')
  })

  it('completing the last step marks the routine complete and completed today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-r1-s3'))
    expect(screen.getByTestId('step-r1-s3')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('routine-r1')).toHaveAttribute('data-complete', 'true')
    expect(screen.getByTestId('today-completed')).toHaveTextContent('1')
  })

  it('undoing a step on a complete routine removes it from completed today', async () => {
    const user = userEvent.setup()
    render(<App />)
    // r2 is complete; toggling a step off should mark incomplete and not completed today
    await user.click(screen.getByTestId('toggle-r2-s1'))
    expect(screen.getByTestId('routine-r2')).toHaveAttribute('data-complete', 'false')
    // re-completing should add today to history => completed today = 1
    await user.click(screen.getByTestId('toggle-r2-s1'))
    expect(screen.getByTestId('routine-r2')).toHaveAttribute('data-complete', 'true')
    expect(screen.getByTestId('today-completed')).toHaveTextContent('1')
  })

  it('completing both routines counts two completed today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-r1-s3'))
    // re-complete r2 (toggle off then on) to add today
    await user.click(screen.getByTestId('toggle-r2-s2'))
    await user.click(screen.getByTestId('toggle-r2-s2'))
    expect(screen.getByTestId('today-completed')).toHaveTextContent('2')
  })

  it('shows the empty state when there are no routines', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-routines'))
    await user.click(screen.getByTestId('delete-r1'))
    await user.click(screen.getByTestId('delete-r2'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByTestId('today-completed')).toHaveTextContent('0')
  })
})
