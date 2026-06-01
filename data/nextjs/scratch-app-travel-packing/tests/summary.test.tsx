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
    expect(screen.getByTestId('stat-items-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-packed-value')).toHaveTextContent('1')
  })

  it('lists per-trip progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('progress-tr1-percent')).toHaveTextContent('33')
    expect(screen.getByTestId('progress-tr2-percent')).toHaveTextContent('0')
  })

  it('reflects a packed toggle in the summary count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('toggle-i2'))
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('stat-packed-value')).toHaveTextContent('2')
  })
})
