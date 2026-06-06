import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Age Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /age calculator/i })).toBeInTheDocument()
  })

  it('shows -- for all values when birth date is empty', () => {
    render(<App />)
    expect(screen.getByTestId('age-years').textContent).toBe('--')
    expect(screen.getByTestId('age-months').textContent).toBe('--')
    expect(screen.getByTestId('age-days').textContent).toBe('--')
    expect(screen.getByTestId('age-summary').textContent).toBe('--')
  })

  it('calculates age correctly for a known date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '1990-06-15')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-06-15')
    expect(screen.getByTestId('age-years').textContent).toBe('35')
    expect(screen.getByTestId('age-months').textContent).toBe('0')
    expect(screen.getByTestId('age-days').textContent).toBe('0')
  })

  it('calculates age with remaining months and days', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '2000-01-01')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-04-15')
    expect(screen.getByTestId('age-years').textContent).toBe('25')
    expect(screen.getByTestId('age-months').textContent).toBe('3')
    expect(screen.getByTestId('age-days').textContent).toBe('14')
  })

  it('shows age summary string', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '2000-01-01')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-04-15')
    expect(screen.getByTestId('age-summary').textContent).toBe('25 years, 3 months, 14 days')
  })

  it('shows -- when birth date is after as-of date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '2030-01-01')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-01-01')
    expect(screen.getByTestId('age-years').textContent).toBe('--')
    expect(screen.getByTestId('age-summary').textContent).toBe('--')
  })

  it('shows next birthday', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '1990-12-25')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-06-01')
    const nb = screen.getByTestId('next-birthday').textContent
    expect(nb).toContain('December')
    expect(nb).toContain('25')
    expect(nb).toContain('2025')
  })

  it('shows Today! when as-of date is birthday', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '1990-06-15')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-06-15')
    expect(screen.getByTestId('next-birthday').textContent).toBe('Today!')
  })

  it('shows -- for next birthday when birth date is empty', () => {
    render(<App />)
    expect(screen.getByTestId('next-birthday').textContent).toBe('--')
  })

  it('reset button clears birth date and shows --', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '1990-01-01')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('age-years').textContent).toBe('--')
    expect(screen.getByTestId('age-summary').textContent).toBe('--')
  })

  it('handles age of exactly 1 year', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '2024-03-10')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-03-10')
    expect(screen.getByTestId('age-years').textContent).toBe('1')
    expect(screen.getByTestId('age-months').textContent).toBe('0')
    expect(screen.getByTestId('age-days').textContent).toBe('0')
  })

  it('live updates when as-of date changes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Birth Date'), '2000-06-01')
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2025-06-01')
    const y1 = screen.getByTestId('age-years').textContent
    await user.clear(screen.getByLabelText('As Of Date'))
    await user.type(screen.getByLabelText('As Of Date'), '2026-06-01')
    const y2 = screen.getByTestId('age-years').textContent
    expect(y2).not.toBe(y1)
  })
})
