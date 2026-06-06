import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Calorie Counter App', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /calorie counter/i })).toBeInTheDocument()
  })

  it('shows all 10 food items initially', () => {
    render(<App />)
    expect(screen.getAllByTestId('food-item')).toHaveLength(10)
  })

  it('goal input starts at 2000', () => {
    render(<App />)
    expect(screen.getByLabelText(/daily goal/i)).toHaveValue(2000)
  })

  it('consumed total starts at 0', () => {
    render(<App />)
    expect(screen.getByTestId('consumed-total').textContent).toBe('0')
  })

  it('remaining starts equal to goal', () => {
    render(<App />)
    expect(screen.getByTestId('remaining').textContent).toBe('2000')
  })

  it('status is Under goal initially', () => {
    render(<App />)
    expect(screen.getByTestId('status').textContent).toBe('Under goal')
  })

  it('searches foods by name case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/search food/i), 'egg')
    expect(screen.getAllByTestId('food-item')).toHaveLength(1)
    expect(screen.getByTestId('food-list').textContent).toContain('Boiled Egg')
  })

  it('empty search shows all foods', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/search food/i), 'egg')
    await user.clear(screen.getByLabelText(/search food/i))
    expect(screen.getAllByTestId('food-item')).toHaveLength(10)
  })

  it('adds food to consumed list', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addBtns = screen.getAllByRole('button', { name: /^add$/i })
    await user.click(addBtns[0]) // Apple 95
    expect(screen.getAllByTestId('consumed-item')).toHaveLength(1)
    expect(screen.getByTestId('consumed-total').textContent).toBe('95')
  })

  it('updates remaining after adding food', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addBtns = screen.getAllByRole('button', { name: /^add$/i })
    await user.click(addBtns[0]) // Apple 95
    expect(screen.getByTestId('remaining').textContent).toBe('1905')
  })

  it('shows Over goal status when consumed exceeds goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Set goal to 50
    await user.clear(screen.getByLabelText(/daily goal/i))
    await user.type(screen.getByLabelText(/daily goal/i), '50')
    const addBtns = screen.getAllByRole('button', { name: /^add$/i })
    await user.click(addBtns[0]) // Apple 95
    expect(screen.getByTestId('status').textContent).toBe('Over goal')
  })

  it('removes a consumed item', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addBtns = screen.getAllByRole('button', { name: /^add$/i })
    await user.click(addBtns[0])
    const removeBtn = screen.getByRole('button', { name: /remove/i })
    await user.click(removeBtn)
    expect(screen.queryAllByTestId('consumed-item')).toHaveLength(0)
    expect(screen.getByTestId('consumed-total').textContent).toBe('0')
  })

  it('can add the same food twice', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addBtns = screen.getAllByRole('button', { name: /^add$/i })
    await user.click(addBtns[0])
    await user.click(addBtns[0])
    expect(screen.getAllByTestId('consumed-item')).toHaveLength(2)
    expect(screen.getByTestId('consumed-total').textContent).toBe('190')
  })

  it('changing goal updates remaining', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/daily goal/i))
    await user.type(screen.getByLabelText(/daily goal/i), '1500')
    expect(screen.getByTestId('remaining').textContent).toBe('1500')
  })
})
