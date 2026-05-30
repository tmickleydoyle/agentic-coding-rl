import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today flow', () => {
  it('shows today date and goal with zero steps before logging', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-28')
    expect(screen.getByTestId('today-goal')).toHaveTextContent('10000')
    expect(screen.getByTestId('today-steps')).toHaveTextContent('0')
    expect(screen.getByTestId('today-percent')).toHaveTextContent('0')
    expect(screen.getByTestId('today-met')).toHaveAttribute('data-met', 'false')
  })

  it('blocks logging an invalid step count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('steps-input'), 'abc')
    await user.click(screen.getByTestId('submit-steps'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('today-steps')).toHaveTextContent('0')
  })

  it('logs steps for today and updates the count and percent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('steps-input'), '5000')
    await user.click(screen.getByTestId('submit-steps'))
    expect(screen.getByTestId('today-steps')).toHaveTextContent('5000')
    expect(screen.getByTestId('today-percent')).toHaveTextContent('50')
    expect(screen.getByTestId('today-met')).toHaveAttribute('data-met', 'false')
  })

  it('marks the goal met and caps percent at 100', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('steps-input'), '15000')
    await user.click(screen.getByTestId('submit-steps'))
    expect(screen.getByTestId('today-percent')).toHaveTextContent('100')
    expect(screen.getByTestId('today-met')).toHaveAttribute('data-met', 'true')
  })

  it('logging again for today replaces the value (upsert)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('steps-input'), '5000')
    await user.click(screen.getByTestId('submit-steps'))
    await user.type(screen.getByTestId('steps-input'), '8000')
    await user.click(screen.getByTestId('submit-steps'))
    expect(screen.getByTestId('today-steps')).toHaveTextContent('8000')
  })

  it('a logged today entry appears in history without duplicating', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('steps-input'), '9000')
    await user.click(screen.getByTestId('submit-steps'))
    await user.type(screen.getByTestId('steps-input'), '9500')
    await user.click(screen.getByTestId('submit-steps'))
    await user.click(screen.getByTestId('nav-history'))
    // seed has 3 entries; one upserted today entry => 4 rows total
    expect(screen.getByTestId('entry-list').querySelectorAll('li').length).toBe(4)
  })
})
