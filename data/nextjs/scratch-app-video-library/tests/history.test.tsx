import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history aggregate', () => {
  it('shows empty-history with nothing watched', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('empty-history')).toBeInTheDocument()
  })

  it('aggregates watched count and total watch time', async () => {
    const user = userEvent.setup()
    render(<App />)
    // watch v1 (600) and v2 (900)
    await user.click(screen.getByTestId('open-v1'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-browse'))
    await user.click(screen.getByTestId('open-v2'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('watched-count-value')).toHaveTextContent('2')
    expect(screen.getByTestId('total-watch-time-value')).toHaveTextContent('1500')
  })

  it('lists watched videos newest-first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v1'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-browse'))
    await user.click(screen.getByTestId('open-v3'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-history'))
    const items = screen.getAllByTestId(/^hist-v\d$/)
    expect(items[0]).toHaveAttribute('data-testid', 'hist-v3')
    expect(items[1]).toHaveAttribute('data-testid', 'hist-v1')
  })
})
