import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Calorie Burn Estimator', () => {
  it('shows 3 seed entries', () => {
    render(<App />)
    expect(screen.getAllByTestId('workout-entry')).toHaveLength(3)
  })

  it('shows seed activity names', () => {
    render(<App />)
    const activities = screen.getAllByTestId('entry-activity').map(el => el.textContent)
    expect(activities).toContain('Running')
    expect(activities).toContain('Cycling')
    expect(activities).toContain('Swimming')
  })

  it('shows correct calories for seed entries', () => {
    render(<App />)
    const cals = screen.getAllByTestId('entry-calories').map(el => el.textContent)
    expect(cals).toContain('300 cal')  // Running 30 * 10
    expect(cals).toContain('360 cal')  // Cycling 45 * 8
    expect(cals).toContain('180 cal')  // Swimming 20 * 9
  })

  it('shows correct total calories stat', () => {
    render(<App />)
    expect(screen.getByTestId('total-calories').textContent).toBe('Total calories burned: 840')
  })

  it('shows correct total minutes stat', () => {
    render(<App />)
    expect(screen.getByTestId('total-minutes').textContent).toBe('Total minutes: 95')
  })

  it('shows correct workout count', () => {
    render(<App />)
    expect(screen.getByTestId('total-workouts').textContent).toBe('Workouts: 3')
  })

  it('add button disabled when duration is empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /add workout/i })).toBeDisabled()
  })

  it('adds a workout and calculates calories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/activity/i), 'Jump Rope')
    await user.clear(screen.getByLabelText(/duration \(minutes\)/i))
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '10')
    await user.click(screen.getByRole('button', { name: /add workout/i }))
    expect(screen.getAllByTestId('workout-entry')).toHaveLength(4)
    const cals = screen.getAllByTestId('entry-calories').map(el => el.textContent)
    expect(cals).toContain('120 cal')  // Jump Rope 10 * 12
  })

  it('updates total calories after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/activity/i), 'Walking')
    await user.clear(screen.getByLabelText(/duration \(minutes\)/i))
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '25')
    await user.click(screen.getByRole('button', { name: /add workout/i }))
    expect(screen.getByTestId('total-calories').textContent).toBe('Total calories burned: 940')
  })

  it('clears duration input after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/duration \(minutes\)/i))
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '15')
    await user.click(screen.getByRole('button', { name: /add workout/i }))
    expect(screen.getByLabelText(/duration \(minutes\)/i)).toHaveValue(null)
  })

  it('removes a workout', async () => {
    const user = userEvent.setup()
    render(<App />)
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(screen.getAllByTestId('workout-entry')).toHaveLength(2)
  })

  it('shows empty message when all entries removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    const getRemoves = () => screen.queryAllByRole('button', { name: /remove/i })
    await user.click(getRemoves()[0])
    await user.click(getRemoves()[0])
    await user.click(getRemoves()[0])
    expect(screen.getByTestId('empty-message')).toBeInTheDocument()
  })

  it('updates stats after removing', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Remove Running (300 cal, 30 min)
    await user.click(screen.getAllByRole('button', { name: /remove/i })[0])
    expect(screen.getByTestId('total-calories').textContent).toBe('Total calories burned: 540')
    expect(screen.getByTestId('total-minutes').textContent).toBe('Total minutes: 65')
  })
})
