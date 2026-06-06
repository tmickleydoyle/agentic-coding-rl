import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Moving Checklist', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /moving checklist/i })).toBeInTheDocument()
  })

  it('shows all 8 seed tasks', () => {
    render(<App />)
    expect(screen.getAllByTestId('task-item')).toHaveLength(8)
  })

  it('shows progress as 0 of 8 initially', () => {
    render(<App />)
    expect(screen.getByTestId('progress').textContent).toBe('0 of 8 tasks complete')
  })

  it('progress bar has correct max', () => {
    render(<App />)
    const bar = screen.getByTestId('progress-bar') as HTMLProgressElement
    expect(bar.max).toBe(8)
    expect(bar.value).toBe(0)
  })

  it('checking a task marks it done', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('Book moving truck'))
    expect(screen.getByTestId('progress').textContent).toBe('1 of 8 tasks complete')
  })

  it('task-item gets data-completed=true when checked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('Book moving truck'))
    const items = screen.getAllByTestId('task-item')
    const bookItem = items.find(el => el.textContent?.includes('Book moving truck'))
    expect(bookItem?.getAttribute('data-completed')).toBe('true')
  })

  it('filter button shows only that category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^packing$/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(3)
  })

  it('active filter button has aria-pressed=true', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^admin$/i }))
    expect(screen.getByRole('button', { name: /^admin$/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('adds a new task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/new task/i), 'Label boxes')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(9)
    expect(screen.getByText('Label boxes')).toBeInTheDocument()
  })

  it('does not add task with empty input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(8)
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('task-item')).toHaveLength(7)
  })

  it('clear completed removes done tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('Book moving truck'))
    await user.click(screen.getByLabelText('Hire movers'))
    await user.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(6)
    expect(screen.getByTestId('progress').textContent).toBe('0 of 6 tasks complete')
  })

  it('progress counts all tasks regardless of filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('Book moving truck'))
    await user.click(screen.getByRole('button', { name: /^packing$/i }))
    expect(screen.getByTestId('progress').textContent).toBe('1 of 8 tasks complete')
  })
})
