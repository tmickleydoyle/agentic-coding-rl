import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Workout Plan', () => {
  it('shows seed exercises', () => {
    render(<App />)
    expect(screen.getAllByTestId('exercise-item')).toHaveLength(3)
  })

  it('shows seed exercise names', () => {
    render(<App />)
    const names = screen.getAllByTestId('exercise-name').map(el => el.textContent)
    expect(names).toContain('Push-ups')
    expect(names).toContain('Squats')
    expect(names).toContain('Pull-ups')
  })

  it('shows sets x reps for seed data', () => {
    render(<App />)
    const setsReps = screen.getAllByTestId('exercise-sets-reps').map(el => el.textContent)
    expect(setsReps).toContain('3 × 15')
    expect(setsReps).toContain('4 × 12')
    expect(setsReps).toContain('3 × 8')
  })

  it('shows correct total count', () => {
    render(<App />)
    expect(screen.getByTestId('total-count').textContent).toBe('Total exercises: 3')
  })

  it('shows correct total sets', () => {
    render(<App />)
    expect(screen.getByTestId('total-sets').textContent).toBe('Total sets: 10')
  })

  it('add button is disabled when name is empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /add exercise/i })).toBeDisabled()
  })

  it('adds an exercise', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Lunges')
    await user.click(screen.getByRole('button', { name: /add exercise/i }))
    expect(screen.getAllByTestId('exercise-item')).toHaveLength(4)
    const names = screen.getAllByTestId('exercise-name').map(el => el.textContent)
    expect(names).toContain('Lunges')
  })

  it('clears name input after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Lunges')
    await user.click(screen.getByRole('button', { name: /add exercise/i }))
    expect(screen.getByLabelText(/exercise name/i)).toHaveValue('')
  })

  it('updates total count and sets after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/sets/i))
    await user.type(screen.getByLabelText(/sets/i), '5')
    await user.type(screen.getByLabelText(/exercise name/i), 'Deadlift')
    await user.click(screen.getByRole('button', { name: /add exercise/i }))
    expect(screen.getByTestId('total-count').textContent).toBe('Total exercises: 4')
    expect(screen.getByTestId('total-sets').textContent).toBe('Total sets: 15')
  })

  it('removes an exercise', async () => {
    const user = userEvent.setup()
    render(<App />)
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(screen.getAllByTestId('exercise-item')).toHaveLength(2)
  })

  it('shows empty message when all removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    const removeButtons = () => screen.queryAllByRole('button', { name: /remove/i })
    await user.click(removeButtons()[0])
    await user.click(removeButtons()[0])
    await user.click(removeButtons()[0])
    expect(screen.getByTestId('empty-message')).toBeInTheDocument()
  })

  it('groups exercises by day headings', () => {
    render(<App />)
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
  })

  it('does not show days with no exercises', () => {
    render(<App />)
    expect(screen.queryByText('Tuesday')).not.toBeInTheDocument()
  })
})
