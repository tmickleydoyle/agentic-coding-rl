import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('records and stats', () => {
  it('shows total workouts, sets, and volume from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-records'))
    // seed: 2 workouts, 4 sets total
    expect(screen.getByTestId('stat-workouts-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-sets-value')).toHaveTextContent('4')
    // volume: 8*100 + 8*100 + 5*140 + 5*150 = 800+800+700+750 = 3050
    expect(screen.getByTestId('stat-volume-value')).toHaveTextContent('3050')
  })

  it('shows personal records per exercise', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-records'))
    expect(screen.getByTestId('record-e1-value')).toHaveTextContent('100') // bench best 100
    expect(screen.getByTestId('record-e2-value')).toHaveTextContent('150') // squat best 150
    expect(screen.getByTestId('record-e3-value')).toHaveTextContent('0') // never trained
  })

  it('updates stats after logging a new workout', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('name-input'), 'Heavy Bench')
    await user.selectOptions(screen.getByTestId('exercise-select'), 'e1')
    await user.clear(screen.getByTestId('reps-input'))
    await user.type(screen.getByTestId('reps-input'), '3')
    await user.clear(screen.getByTestId('weight-input'))
    await user.type(screen.getByTestId('weight-input'), '120')
    await user.click(screen.getByTestId('submit-workout'))
    await user.click(screen.getByTestId('nav-records'))
    expect(screen.getByTestId('stat-workouts-value')).toHaveTextContent('3')
    expect(screen.getByTestId('record-e1-value')).toHaveTextContent('120') // new PR
  })

  it('lists all exercises on the exercises page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-exercises'))
    expect(screen.getByTestId('exercise-e1-name')).toHaveTextContent('Bench Press')
    expect(screen.getByTestId('exercise-e1-muscle')).toHaveTextContent('Chest')
    expect(screen.getByTestId('exercise-e3-name')).toHaveTextContent('Deadlift')
  })
})
