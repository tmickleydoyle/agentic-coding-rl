import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the log page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-log')).toBeInTheDocument()
    expect(screen.getByTestId('nav-log')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-exercises')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the exercises page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-exercises'))
    expect(screen.getByTestId('page-exercises')).toBeInTheDocument()
    expect(screen.getByTestId('nav-exercises')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-log')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the records page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-records'))
    expect(screen.getByTestId('page-records')).toBeInTheDocument()
    expect(screen.getByTestId('nav-records')).toHaveAttribute('aria-current', 'page')
  })

  it('shows the detail page with no selection placeholder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-workout-detail'))
    expect(screen.getByTestId('page-workout-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
