import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the quizzes page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-quizzes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-quizzes')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-take')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the take page via nav', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-take'))
    expect(screen.getByTestId('page-take')).toBeInTheDocument()
    expect(screen.getByTestId('nav-take')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to results and review', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-results'))
    expect(screen.getByTestId('page-results')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-review'))
    expect(screen.getByTestId('page-review')).toBeInTheDocument()
    expect(screen.getByTestId('nav-results')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
