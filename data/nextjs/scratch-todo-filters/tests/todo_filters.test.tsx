import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addTodo(u: ReturnType<typeof userEvent.setup>, text: string) {
  await u.clear(screen.getByLabelText(/new todo/i))
  await u.type(screen.getByLabelText(/new todo/i), text)
  await u.click(screen.getByRole('button', { name: /add todo/i }))
}

describe('Todo List with Filters', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /todo list/i })).toBeInTheDocument()
  })

  it('shows 0 items left initially', () => {
    render(<App />)
    expect(screen.getByText('0 items left')).toBeInTheDocument()
  })

  it('adds a todo item to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Buy milk')
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('clears the input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Buy milk')
    expect(screen.getByLabelText(/new todo/i)).toHaveValue('')
  })

  it('ignores blank todo titles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add todo/i }))
    expect(screen.getByText('0 items left')).toBeInTheDocument()
  })

  it('updates items left count after adding todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    await addTodo(u, 'Task B')
    expect(screen.getByText('2 items left')).toBeInTheDocument()
  })

  it('decrements items left when a todo is toggled complete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    await addTodo(u, 'Task B')
    await u.click(screen.getByLabelText(/toggle task a/i))
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('re-increments items left when a completed todo is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    await u.click(screen.getByLabelText(/toggle task a/i))
    await u.click(screen.getByLabelText(/toggle task a/i))
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('deletes a todo item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    const li = screen.getByText('Task A').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('0 items left')).toBeInTheDocument()
  })

  it('Active filter shows only incomplete todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Active task')
    await addTodo(u, 'Done task')
    await u.click(screen.getByLabelText(/toggle done task/i))
    await u.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
  })

  it('Completed filter shows only completed todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Active task')
    await addTodo(u, 'Done task')
    await u.click(screen.getByLabelText(/toggle done task/i))
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })

  it('All filter shows every todo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Active task')
    await addTodo(u, 'Done task')
    await u.click(screen.getByLabelText(/toggle done task/i))
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })

  it('items left count is unaffected by filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'A')
    await addTodo(u, 'B')
    await addTodo(u, 'C')
    await u.click(screen.getByLabelText(/toggle a/i))
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.getByText('2 items left')).toBeInTheDocument()
  })

  it('Clear completed button is disabled when no completed todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeDisabled()
  })

  it('Clear completed button is enabled when there are completed todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task A')
    await u.click(screen.getByLabelText(/toggle task a/i))
    expect(screen.getByRole('button', { name: /clear completed/i })).not.toBeDisabled()
  })

  it('Clear completed removes all completed todos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Keep me')
    await addTodo(u, 'Remove me')
    await u.click(screen.getByLabelText(/toggle remove me/i))
    await u.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('adds a todo via Enter key', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new todo/i), 'Enter task{Enter}')
    expect(screen.getByText('Enter task')).toBeInTheDocument()
  })
})
