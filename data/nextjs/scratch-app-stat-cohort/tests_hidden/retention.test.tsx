import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('retention detail', () => {
  it('shows a no-selection message before selecting a cohort', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-retention'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('shows retention percentages per period for the selected cohort', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-c1'))
    expect(screen.getByTestId('period-M0-pct')).toHaveTextContent('100')
    expect(screen.getByTestId('period-M1-pct')).toHaveTextContent('60')
    expect(screen.getByTestId('period-M2-pct')).toHaveTextContent('40')
    expect(screen.getByTestId('period-M3-pct')).toHaveTextContent('20')
  })

  it('computes retained user counts from size and percentage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-c1'))
    // size 200: M0 200, M1 120, M2 80, M3 40
    expect(screen.getByTestId('period-M0-users')).toHaveTextContent('200')
    expect(screen.getByTestId('period-M1-users')).toHaveTextContent('120')
    expect(screen.getByTestId('period-M2-users')).toHaveTextContent('80')
    expect(screen.getByTestId('period-M3-users')).toHaveTextContent('40')
  })

  it('updates the detail when a different cohort is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-c4'))
    expect(screen.getByTestId('detail-month')).toHaveTextContent('Apr')
    // size 50: M2 = round(50*60/100) = 30
    expect(screen.getByTestId('period-M2-users')).toHaveTextContent('30')
  })
})
