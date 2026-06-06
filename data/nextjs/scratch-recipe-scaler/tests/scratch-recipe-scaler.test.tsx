import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Recipe Scaler App', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /recipe scaler/i })).toBeInTheDocument()
  })

  it('shows Chocolate Chip Cookies selected by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /chocolate chip cookies/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows base servings for default recipe', () => {
    render(<App />)
    expect(screen.getByTestId('base-servings').textContent).toBe('Base: 24 servings')
  })

  it('shows 9 ingredients for Chocolate Chip Cookies', () => {
    render(<App />)
    expect(screen.getAllByTestId('ingredient')).toHaveLength(9)
  })

  it('scale factor is 1.00x at base servings', () => {
    render(<App />)
    expect(screen.getByTestId('scale-factor').textContent).toBe('Scale: 1.00×')
  })

  it('scaling to 48 servings doubles amounts', async () => {
    const user = userEvent.setup()
    render(<App />)
    const servingsInput = screen.getByLabelText(/servings/i)
    await user.clear(servingsInput)
    await user.type(servingsInput, '48')
    expect(screen.getByTestId('scale-factor').textContent).toBe('Scale: 2.00×')
    // flour: 2.25 * 2 = 4.50
    const amounts = screen.getAllByTestId('ingredient-amount')
    expect(amounts[0].textContent).toBe('4.50')
  })

  it('switches to Banana Bread recipe', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /banana bread/i }))
    expect(screen.getByRole('button', { name: /banana bread/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /chocolate chip cookies/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByTestId('ingredient')).toHaveLength(8)
  })

  it('resets servings to base when switching recipes', async () => {
    const user = userEvent.setup()
    render(<App />)
    const servingsInput = screen.getByLabelText(/servings/i)
    await user.clear(servingsInput)
    await user.type(servingsInput, '48')
    await user.click(screen.getByRole('button', { name: /banana bread/i }))
    expect(servingsInput).toHaveValue(8)
    expect(screen.getByTestId('scale-factor').textContent).toBe('Scale: 1.00×')
  })

  it('shows correct base servings for Pancakes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /pancakes/i }))
    expect(screen.getByTestId('base-servings').textContent).toBe('Base: 4 servings')
  })

  it('shows 7 ingredients for Pancakes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /pancakes/i }))
    expect(screen.getAllByTestId('ingredient')).toHaveLength(7)
  })

  it('scales Pancakes to 8 servings correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /pancakes/i }))
    const servingsInput = screen.getByLabelText(/servings/i)
    await user.clear(servingsInput)
    await user.type(servingsInput, '8')
    // flour: 1 * 2 = 2.00
    expect(screen.getAllByTestId('ingredient-amount')[0].textContent).toBe('2.00')
    expect(screen.getByTestId('scale-factor').textContent).toBe('Scale: 2.00×')
  })

  it('treats servings below 1 as 1', async () => {
    const user = userEvent.setup()
    render(<App />)
    const servingsInput = screen.getByLabelText(/servings/i)
    await user.clear(servingsInput)
    await user.type(servingsInput, '0')
    expect(screen.getByTestId('scale-factor').textContent).toBe('Scale: 0.04×')
    // servings=1 out of 24 base -> 0.04x
    // value should not go below 1 per spec
  })

  it('amounts display with 2 decimal places', () => {
    render(<App />)
    const amounts = screen.getAllByTestId('ingredient-amount')
    amounts.forEach(a => {
      expect(a.textContent).toMatch(/^\d+\.\d{2}$/)
    })
  })
})
