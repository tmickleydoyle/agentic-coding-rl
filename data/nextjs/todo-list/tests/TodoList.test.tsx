import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../components/TodoList'

const addTodo = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  const input = screen.getByTestId('todo-input') as HTMLInputElement
  await user.clear(input)
  await user.type(input, text)
  await user.click(screen.getByTestId('add-btn'))
}

describe('TodoList', () => {
  it('starts with an empty list', () => {
    render(<TodoList />)
    expect(within(screen.getByTestId('todo-list')).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('adds a todo when Add is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await addTodo(user, 'buy milk')
    const items = within(screen.getByTestId('todo-list')).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('buy milk')
  })

  it('clears the input after adding', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await addTodo(user, 'walk dog')
    expect((screen.getByTestId('todo-input') as HTMLInputElement).value).toBe('')
  })

  it('does not add empty or whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await addTodo(user, '   ')
    await user.click(screen.getByTestId('add-btn'))
    expect(within(screen.getByTestId('todo-list')).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('removes the specific todo when its Remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await addTodo(user, 'first')
    await addTodo(user, 'second')
    await addTodo(user, 'third')
    const items = within(screen.getByTestId('todo-list')).getAllByRole('listitem')
    // Remove the middle one
    await user.click(within(items[1]).getByRole('button', { name: /remove/i }))
    const remaining = within(screen.getByTestId('todo-list')).getAllByRole('listitem')
    expect(remaining).toHaveLength(2)
    expect(remaining[0]).toHaveTextContent('first')
    expect(remaining[1]).toHaveTextContent('third')
  })
})
