import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add and completed', () => {
  it('lists seeded completed goals with a count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-completed'))
    expect(screen.getByTestId('completed-g2')).toHaveTextContent('Read 12 books')
    expect(screen.getByTestId('stat-completed-count-value')).toHaveTextContent('1')
  })

  it('blocks adding a goal with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('date-input'), '2026-09-01')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks adding a goal with a blank date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Learn guitar')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a goal and navigates to the goals list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Learn guitar')
    await user.type(screen.getByTestId('date-input'), '2026-09-01')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('page-goals')).toBeInTheDocument()
    expect(screen.getByTestId('goal-g3-name')).toHaveTextContent('Learn guitar')
    // fresh goal has one not-done milestone => 0%
    expect(screen.getByTestId('goal-g3-progress')).toHaveTextContent('0')
  })

  it('a newly added goal has a seeded milestone in its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Learn guitar')
    await user.type(screen.getByTestId('date-input'), '2026-09-01')
    await user.click(screen.getByTestId('submit-goal'))
    await user.click(screen.getByTestId('view-g3'))
    expect(screen.getByTestId('ms-g3-m1')).toBeInTheDocument()
  })

  it('completing an active goal increases the completed count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('toggle-ms-g1-m3'))
    await user.click(screen.getByTestId('toggle-ms-g1-m4'))
    await user.click(screen.getByTestId('nav-completed'))
    expect(screen.getByTestId('stat-completed-count-value')).toHaveTextContent('2')
  })
})
