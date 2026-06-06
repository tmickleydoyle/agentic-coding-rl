import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Goal Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /goal tracker/i })).toBeInTheDocument()
  })

  it('shows 3 seed goals', () => {
    expect(screen.getAllByTestId('goal-item')).toHaveLength(3)
  })

  it('shows goal count', () => {
    expect(screen.getByTestId('goal-count').textContent).toBe('Goals: 3')
  })

  it('shows completed count (0 initially)', () => {
    expect(screen.getByTestId('completed-goals').textContent).toBe('Completed: 0')
  })

  it('shows progress text for first goal', () => {
    const texts = screen.getAllByTestId('progress-text')
    expect(texts[0].textContent).toBe('45 / 100')
  })

  it('shows progress percentage for first goal', () => {
    const pcts = screen.getAllByTestId('progress-pct')
    expect(pcts[0].textContent).toBe('45%')
  })

  it('progress bar width matches percentage', () => {
    const bars = screen.getAllByTestId('progress-bar')
    expect((bars[0] as HTMLElement).style.width).toBe('45%')
  })

  it('updates progress when Update Progress clicked', async () => {
    const user = userEvent.setup()
    const inputs = screen.getAllByRole('spinbutton')
    await user.clear(inputs[0])
    await user.type(inputs[0], '80')
    await user.click(screen.getAllByRole('button', { name: /update progress/i })[0])
    const texts = screen.getAllByTestId('progress-text')
    expect(texts[0].textContent).toBe('80 / 100')
  })

  it('clamps progress to target max', async () => {
    const user = userEvent.setup()
    const inputs = screen.getAllByRole('spinbutton')
    await user.clear(inputs[0])
    await user.type(inputs[0], '999')
    await user.click(screen.getAllByRole('button', { name: /update progress/i })[0])
    const texts = screen.getAllByTestId('progress-text')
    expect(texts[0].textContent).toBe('100 / 100')
  })

  it('increments completed count when goal reaches target', async () => {
    const user = userEvent.setup()
    const inputs = screen.getAllByRole('spinbutton')
    await user.clear(inputs[0])
    await user.type(inputs[0], '100')
    await user.click(screen.getAllByRole('button', { name: /update progress/i })[0])
    expect(screen.getByTestId('completed-goals').textContent).toBe('Completed: 1')
  })

  it('adds a new goal', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/goal title/i), 'Write a Book')
    await user.type(screen.getByLabelText(/target value/i), '300')
    await user.type(screen.getByLabelText(/category/i), 'Creative')
    await user.click(screen.getByRole('button', { name: /add goal/i }))
    expect(screen.getAllByTestId('goal-item')).toHaveLength(4)
    expect(screen.getByText('Write a Book')).toBeInTheDocument()
  })

  it('clears inputs after adding goal', async () => {
    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/goal title/i)
    await user.type(titleInput, 'New Goal')
    await user.click(screen.getByRole('button', { name: /add goal/i }))
    expect((titleInput as HTMLInputElement).value).toBe('')
  })

  it('ignores add with empty title', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add goal/i }))
    expect(screen.getAllByTestId('goal-item')).toHaveLength(3)
  })

  it('updates goal count after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/goal title/i), 'New Goal')
    await user.click(screen.getByRole('button', { name: /add goal/i }))
    expect(screen.getByTestId('goal-count').textContent).toBe('Goals: 4')
  })
})
