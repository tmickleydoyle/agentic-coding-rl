import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the bins page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-bins')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bins')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-map')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the map page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-map'))
    expect(screen.getByTestId('page-map')).toBeInTheDocument()
    expect(screen.getByTestId('nav-map')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-bins')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the move page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-move'))
    expect(screen.getByTestId('page-move')).toBeInTheDocument()
  })

  it('shows a no-selection message on detail when nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bin-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
