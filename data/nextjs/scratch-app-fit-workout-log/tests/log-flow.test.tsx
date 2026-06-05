import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('log flow', () => {
  it('lists seeded workouts on the log page', () => {
    render(<App />)
    const list = screen.getByTestId('workout-list')
    expect(within(list).getByText('Push Day')).toBeInTheDocument()
    expect(within(list).getByText('Leg Day')).toBeInTheDocument()
  })

  it('shows the total set count for a seeded workout', () => {
    render(<App />)
    // w1 Push Day has two sets
    expect(screen.getByTestId('workout-w1-sets')).toHaveTextContent('2')
  })

  it('blocks logging a workout with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('submit-workout'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('logs a workout that appears in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('name-input'), 'Pull Day')
    await user.click(screen.getByTestId('submit-workout'))
    expect(within(screen.getByTestId('workout-list')).getByText('Pull Day')).toBeInTheDocument()
  })

  it('the newly logged workout has id w3', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('name-input'), 'Pull Day')
    await user.click(screen.getByTestId('submit-workout'))
    expect(screen.getByTestId('workout-w3')).toBeInTheDocument()
  })

  it('deletes a workout', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('workout-w2')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-w2'))
    expect(screen.queryByTestId('workout-w2')).not.toBeInTheDocument()
  })

  it('opens a workout detail via the View button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-w1'))
    expect(screen.getByTestId('page-workout-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Push Day')
    expect(screen.getByTestId('detail-date')).toHaveTextContent('2026-05-01')
  })

  it('detail page shows the exercise name and set count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-w1'))
    expect(screen.getByTestId('detail-exercise-e1-name')).toHaveTextContent('Bench Press')
    expect(screen.getByTestId('detail-exercise-e1-sets')).toHaveTextContent('2')
  })

  it('detail back button returns to the log', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-w1'))
    await user.click(screen.getByTestId('back-to-log'))
    expect(screen.getByTestId('page-log')).toBeInTheDocument()
  })
})
