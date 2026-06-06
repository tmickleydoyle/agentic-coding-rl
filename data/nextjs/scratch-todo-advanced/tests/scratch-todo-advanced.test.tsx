import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Advanced Todo', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /advanced todo/i })).toBeInTheDocument()
  })

  it('shows 4 seed items', () => {
    render(<App />)
    expect(screen.getAllByTestId('todo-item')).toHaveLength(4)
  })

  it('shows correct initial stats', () => {
    render(<App />)
    expect(screen.getByTestId('total-count').textContent).toBe('4')
    expect(screen.getByTestId('active-count').textContent).toBe('3')
    expect(screen.getByTestId('done-count').textContent).toBe('1')
  })

  it('shows priority badges for seed items', () => {
    render(<App />)
    const badges = screen.getAllByTestId('priority-badge')
    const texts = badges.map(b => b.textContent)
    expect(texts).toContain('high')
    expect(texts).toContain('medium')
    expect(texts).toContain('low')
  })

  it('adds a new todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task/i), 'New task')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getAllByTestId('todo-item')).toHaveLength(5)
    expect(screen.getByText('New task')).toBeInTheDocument()
    expect(screen.getByTestId('total-count').textContent).toBe('5')
  })

  it('does not add empty todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getAllByTestId('todo-item')).toHaveLength(4)
  })

  it('clears input after add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task/i), 'New task')
    await user.click(screen.getByRole('button', { name: /add/i }))
    const input = screen.getByLabelText(/task/i) as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('adds todo with selected priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/task/i), 'Low priority task')
    await user.selectOptions(screen.getByLabelText(/^priority$/i), 'low')
    await user.click(screen.getByRole('button', { name: /add/i }))
    const items = screen.getAllByTestId('todo-item')
    const lastItem = items[items.length - 1]
    expect(lastItem.querySelector('[data-testid="priority-badge"]')?.textContent).toBe('low')
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('todo-item')).toHaveLength(3)
    expect(screen.getByTestId('total-count').textContent).toBe('3')
  })

  it('toggles done state', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('done-count').textContent).toBe('1')
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(screen.getByTestId('done-count').textContent).toBe('2')
    expect(screen.getByTestId('active-count').textContent).toBe('2')
  })

  it('status filter active hides completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'active')
    expect(screen.getAllByTestId('todo-item')).toHaveLength(3)
  })

  it('status filter completed shows only done', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'completed')
    expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
  })

  it('priority filter shows only matching priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/priority filter/i), 'low')
    expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
  })

  it('filters combine: active + high', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'active')
    await user.selectOptions(screen.getByLabelText(/priority filter/i), 'high')
    // "Write unit tests" is high + active; "Fix login bug" is high but done
    expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
  })

  it('stats reflect total not filtered view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'active')
    // Filtered shows 3 but total-count should still be 4
    expect(screen.getByTestId('total-count').textContent).toBe('4')
  })
})
