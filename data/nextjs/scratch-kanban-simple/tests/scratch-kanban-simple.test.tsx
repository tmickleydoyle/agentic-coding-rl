import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Kanban Simple', () => {
  beforeEach(() => render(<App />))

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /kanban board/i })).toBeInTheDocument()
  })

  it('renders three columns', () => {
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
    expect(screen.getByTestId('column-inprogress')).toBeInTheDocument()
    expect(screen.getByTestId('column-done')).toBeInTheDocument()
  })

  it('shows 5 task cards total', () => {
    expect(screen.getAllByTestId('task-card')).toHaveLength(5)
  })

  it('shows correct todo count (2)', () => {
    expect(screen.getByTestId('count-todo').textContent).toBe('2')
  })

  it('shows correct in-progress count (2)', () => {
    expect(screen.getByTestId('count-inprogress').textContent).toBe('2')
  })

  it('shows correct done count (1)', () => {
    expect(screen.getByTestId('count-done').textContent).toBe('1')
  })

  it('moves task right from Todo to In Progress', async () => {
    const user = userEvent.setup()
    const todoCol = screen.getByTestId('column-todo')
    const cards = within(todoCol).getAllByTestId('task-card')
    const moveRightBtn = within(cards[0]).getByRole('button', { name: /move right/i })
    await user.click(moveRightBtn)
    expect(screen.getByTestId('count-todo').textContent).toBe('1')
    expect(screen.getByTestId('count-inprogress').textContent).toBe('3')
  })

  it('moves task left from Done to In Progress', async () => {
    const user = userEvent.setup()
    const doneCol = screen.getByTestId('column-done')
    const cards = within(doneCol).getAllByTestId('task-card')
    const moveLeftBtn = within(cards[0]).getByRole('button', { name: /move left/i })
    await user.click(moveLeftBtn)
    expect(screen.getByTestId('count-done').textContent).toBe('0')
    expect(screen.getByTestId('count-inprogress').textContent).toBe('3')
  })

  it('disables Move Left for Todo tasks', () => {
    const todoCol = screen.getByTestId('column-todo')
    const cards = within(todoCol).getAllByTestId('task-card')
    const btn = within(cards[0]).getByRole('button', { name: /move left/i })
    expect(btn).toBeDisabled()
  })

  it('disables Move Right for Done tasks', () => {
    const doneCol = screen.getByTestId('column-done')
    const cards = within(doneCol).getAllByTestId('task-card')
    const btn = within(cards[0]).getByRole('button', { name: /move right/i })
    expect(btn).toBeDisabled()
  })

  it('adds a new task to Todo', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/task title/i), 'New Feature')
    await user.selectOptions(screen.getByLabelText(/^column$/i), 'Todo')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-card')).toHaveLength(6)
    expect(screen.getByTestId('count-todo').textContent).toBe('3')
  })

  it('adds a task to Done column', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/task title/i), 'Ship it')
    await user.selectOptions(screen.getByLabelText(/^column$/i), 'Done')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByTestId('count-done').textContent).toBe('2')
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/task title/i)
    await user.type(input, 'Temp Task')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(input).toHaveValue('')
  })

  it('does not add task with empty title', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-card')).toHaveLength(5)
  })
})
