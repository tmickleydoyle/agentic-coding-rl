import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Sprint Planner', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /sprint planner/i })).toBeInTheDocument()
  })

  it('shows 5 seed stories', () => {
    render(<App />)
    expect(screen.getAllByTestId('story-item')).toHaveLength(5)
  })

  it('shows correct initial stats', () => {
    render(<App />)
    expect(screen.getByTestId('total-points').textContent).toBe('34')
    expect(screen.getByTestId('done-points').textContent).toBe('3')
    expect(screen.getByTestId('remaining-points').textContent).toBe('31')
  })

  it('shows capacity used as percentage', () => {
    render(<App />)
    // 3/40 * 100 = 7.5 -> 8%
    expect(screen.getByTestId('capacity-used').textContent).toBe('8%')
  })

  it('does not show over-capacity when under', () => {
    render(<App />)
    expect(screen.queryByTestId('over-capacity')).not.toBeInTheDocument()
  })

  it('shows over-capacity when total exceeds capacity', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Set capacity lower than 34
    const capInput = screen.getByLabelText(/sprint capacity/i)
    await user.clear(capInput)
    await user.type(capInput, '20')
    expect(screen.getByTestId('over-capacity')).toBeInTheDocument()
  })

  it('adds a new story', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/story title/i), 'New feature')
    await user.type(screen.getByLabelText(/story points/i), '5')
    await user.click(screen.getByRole('button', { name: /add story/i }))
    expect(screen.getAllByTestId('story-item')).toHaveLength(6)
    expect(screen.getByText('New feature')).toBeInTheDocument()
  })

  it('does not add story with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/story points/i), '5')
    await user.click(screen.getByRole('button', { name: /add story/i }))
    expect(screen.getAllByTestId('story-item')).toHaveLength(5)
  })

  it('does not add story with zero points', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/story title/i), 'Zero story')
    await user.type(screen.getByLabelText(/story points/i), '0')
    await user.click(screen.getByRole('button', { name: /add story/i }))
    expect(screen.getAllByTestId('story-item')).toHaveLength(5)
  })

  it('clears inputs after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/story title/i), 'New feature')
    await user.type(screen.getByLabelText(/story points/i), '5')
    await user.click(screen.getByRole('button', { name: /add story/i }))
    expect((screen.getByLabelText(/story title/i) as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText(/story points/i) as HTMLInputElement).value).toBe('')
  })

  it('removes a story and updates stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(screen.getAllByTestId('story-item')).toHaveLength(4)
    // first story was 8 points, total was 34
    expect(screen.getByTestId('total-points').textContent).toBe('26')
  })

  it('updating status to done increases done-points', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('done-points').textContent).toBe('3')
    // Change "User authentication" (8 pts) to done — it's the first story
    const selects = screen.getAllByRole('combobox')
    await user.selectOptions(selects[0], 'done')
    expect(screen.getByTestId('done-points').textContent).toBe('11')
  })

  it('story points are displayed', () => {
    render(<App />)
    const pts = screen.getAllByTestId('story-points')
    const values = pts.map(p => parseInt(p.textContent ?? '0', 10))
    expect(values).toContain(8)
    expect(values).toContain(13)
    expect(values).toContain(3)
  })

  it('changing capacity updates capacity-used', async () => {
    const user = userEvent.setup()
    render(<App />)
    const capInput = screen.getByLabelText(/sprint capacity/i)
    await user.clear(capInput)
    await user.type(capInput, '30')
    // 3 done points / 30 capacity = 10%
    expect(screen.getByTestId('capacity-used').textContent).toBe('10%')
  })
})
