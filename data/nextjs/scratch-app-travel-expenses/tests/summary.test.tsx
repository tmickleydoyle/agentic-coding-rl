import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('summary page', () => {
  it('shows seeded totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('stat-trips-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('4')
    // grand total 200+50+30+80 = 360
    expect(screen.getByTestId('stat-grand-total-value')).toHaveTextContent('360')
  })

  it('lists per-trip totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('total-tr1-amount')).toHaveTextContent('280')
    expect(screen.getByTestId('total-tr2-amount')).toHaveTextContent('80')
  })

  it('breaks the focus trip down by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    // select tr1 so it is the focus trip
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('nav-summary'))
    // tr1 food = 50 + 30 = 80, lodging = 200
    expect(screen.getByTestId('cat-food-amount')).toHaveTextContent('80')
    expect(screen.getByTestId('cat-lodging-amount')).toHaveTextContent('200')
    // transport only appears in tr2 so it is absent for tr1
    expect(screen.queryByTestId('cat-transport')).not.toBeInTheDocument()
  })
})
