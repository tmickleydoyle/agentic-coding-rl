import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today totals', () => {
  it('shows todays calorie total from seed (m1 + m2)', () => {
    render(<App />)
    // 320 + 450 = 770
    expect(screen.getByTestId('calorie-total-value')).toHaveTextContent('770')
    expect(screen.getByTestId('calorie-goal-value')).toHaveTextContent('2000')
    expect(screen.getByTestId('calorie-remaining-value')).toHaveTextContent('1230')
  })

  it('marks status on-track when under goal', () => {
    render(<App />)
    expect(screen.getByTestId('calorie-status')).toHaveAttribute('data-ontrack', 'true')
    expect(screen.getByTestId('calorie-status')).toHaveTextContent('on-track')
  })

  it('shows summed macros for today', () => {
    render(<App />)
    // protein 12+38=50, carbs 54+20=74, fat 6+22=28
    expect(screen.getByTestId('macro-protein-value')).toHaveTextContent('50')
    expect(screen.getByTestId('macro-carbs-value')).toHaveTextContent('74')
    expect(screen.getByTestId('macro-fat-value')).toHaveTextContent('28')
  })

  it('lists only todays meals (not yesterdays apple)', () => {
    render(<App />)
    const list = screen.getByTestId('meal-list')
    expect(within(list).getByTestId('meal-m1')).toBeInTheDocument()
    expect(within(list).getByTestId('meal-m2')).toBeInTheDocument()
    expect(within(list).queryByTestId('meal-m3')).not.toBeInTheDocument()
  })

  it('removes a meal and updates the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-m1'))
    expect(screen.queryByTestId('meal-m1')).not.toBeInTheDocument()
    expect(screen.getByTestId('calorie-total-value')).toHaveTextContent('450')
  })
})
