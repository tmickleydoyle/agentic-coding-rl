import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Rep Counter', () => {
  it('shows 3 exercise cards from seed', () => {
    render(<App />)
    expect(screen.getAllByTestId('exercise-card')).toHaveLength(3)
  })

  it('shows seed exercise names', () => {
    render(<App />)
    expect(screen.getByText('Push-ups')).toBeInTheDocument()
    expect(screen.getByText('Sit-ups')).toBeInTheDocument()
    expect(screen.getByText('Burpees')).toBeInTheDocument()
  })

  it('shows initial rep displays as 0 / target', () => {
    render(<App />)
    const displays = screen.getAllByTestId('rep-display').map(el => el.textContent)
    expect(displays).toContain('0 / 20')
    expect(displays).toContain('0 / 30')
    expect(displays).toContain('0 / 10')
  })

  it('increments reps on + click', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /\+ Push-ups/i }))
    const displays = screen.getAllByTestId('rep-display').map(el => el.textContent)
    expect(displays).toContain('1 / 20')
  })

  it('updates total reps done on increment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /\+ Burpees/i }))
    await user.click(screen.getByRole('button', { name: /\+ Burpees/i }))
    expect(screen.getByTestId('total-reps-done').textContent).toBe('Total reps done: 2')
  })

  it('resets reps to 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /\+ Push-ups/i }))
    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    await user.click(resetButtons[0])
    const displays = screen.getAllByTestId('rep-display').map(el => el.textContent)
    expect(displays).toContain('0 / 20')
  })

  it('shows complete badge when done >= target', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByTestId('complete-badge')).not.toBeInTheDocument()
    // Add exercise with target 1 for easy completion
    await user.type(screen.getByLabelText(/exercise name/i), 'TestEx')
    await user.clear(screen.getByLabelText(/target reps/i))
    await user.type(screen.getByLabelText(/target reps/i), '1')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    await user.click(screen.getByRole('button', { name: /\+ TestEx/i }))
    expect(screen.getByTestId('complete-badge')).toBeInTheDocument()
  })

  it('disables + button when done >= target', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Mini')
    await user.clear(screen.getByLabelText(/target reps/i))
    await user.type(screen.getByLabelText(/target reps/i), '1')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    await user.click(screen.getByRole('button', { name: /\+ Mini/i }))
    expect(screen.getByRole('button', { name: /\+ Mini/i })).toBeDisabled()
  })

  it('shows completed count in summary', async () => {
    render(<App />)
    expect(screen.getByTestId('completed-count').textContent).toBe('Completed: 0 / 3')
  })

  it('adds a new exercise via form', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Jumping Jacks')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getAllByTestId('exercise-card')).toHaveLength(4)
    expect(screen.getByText('Jumping Jacks')).toBeInTheDocument()
  })

  it('add button disabled when name is empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled()
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Plank')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByLabelText(/exercise name/i)).toHaveValue('')
  })

  it('completed count updates when exercise is completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/exercise name/i), 'Quick')
    await user.clear(screen.getByLabelText(/target reps/i))
    await user.type(screen.getByLabelText(/target reps/i), '1')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    await user.click(screen.getByRole('button', { name: /\+ Quick/i }))
    expect(screen.getByTestId('completed-count').textContent).toBe('Completed: 1 / 4')
  })
})
